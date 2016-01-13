"use strict";

// Note: This would probably be better handled by a message queue,
// maybe disque?

let uuid = require('uuid');
let logger = require('./logger');

// Simple wrapper around subscribing multiple listeners to
// full-table changefeeds.
class FeedManager {
    constructor(db) {
        this.db = db;
        this.listeners = {};
    }

    createFeed(name, setup) {
        return new Promise((resolve, reject) => {
            if (this.listeners[name]) {
                resolve();
                return;
            }
            this.listeners[name] = [];
            let p;
            if (setup) {
                p = setup();
            } else {
                p = this.db.getTableFeed(name);
            }
            p.then((feed) => {
                feed.each((err, change) => {
                    if (err) {
                        logger.error(err);
                        return;
                    }
                    this.listeners[name].forEach((listener) => {
                        listener.fn(change);
                    });
                });
                resolve();
            }).catch(err => reject(err));
        });
    }

    addListener(name, fn) {
        if (this.listeners[name]) {
            let id = uuid.v4();
            this.listeners[name].push({
                id,
                fn
            });
            return id;
        }
        return null;
    }

    removeListener(name, id) {
        if (this.listeners[name]) {
            this.listeners[name] = this.listeners[name]
                .filter(listener => listener.id !== id);
        }
    }
}

module.exports = FeedManager;