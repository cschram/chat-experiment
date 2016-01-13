"use strict";

let logger = require('./logger');

const SERVER_ERROR = 'Unknown server error, please try again later.';

class ConnectionManager {
    constructor(sock, db, feeds) {
        this.sock = sock;
        this.db = db;
        this.feeds = feeds;
        this.username = null;
        this.listeners = {};

        sock.on('disconnect', () => {
            this.logout();
        });

        sock.on('login', (username, done) => {
            this.login(username)
                .then((state) => {
                    this.postLogin();
                    done(null, state);
                })
                .catch(err => done(err));
        });

        sock.on('messages:send', (text, done) => {
            this.sendMessage(text)
                .then(() => done(null))
                .catch(err => done(err));
        });
    }

    login(username) {
        if (this.username) {
            return Promise.reject(`Already logged in as "${username}."`);
        } else {
            return this.db.loginUser(username).then(() => {
                logger.info(`New login from "${username}".`);
                this.username = username;
                return Promise.all([
                    this.db.getUsers(),
                    this.db.getMessages()
                ]);
            }).then((results) => {
                let users = results[0];
                let messages = results[1];
                return { users, messages };
            }).catch((err) => {
                if (typeof err === 'string') {
                    throw err;
                } else {
                    logger.error(err);
                    throw SERVER_ERROR;
                }
            });
        }
    }

    logout() {
        if (this.username) {
            logger.info(`User "${this.username}" logged out.`);
            this.db.logoutUser(this.username).catch(e => logger.error(e));
            Object.keys(this.listeners).forEach(feed => {
                this.feeds.removeListener(feed, this.listeners[feed]);
            });
            this.username = null;
            this.listeners = {};
        }
    }

    postLogin() {
        this.subscribe('users', this.handleUserFeed.bind(this));
        this.subscribe('messages', this.handleMessageFeed.bind(this));
    }

    sendMessage(text) {
        if (!this.username) {
            Promise.reject('You must be logged in.');
        } else {
            return this.db.sendMessage(this.username, text);
        }
    }

    subscribe(feed, fn) {
        this.listeners[feed] = this.feeds.addListener(feed, fn);
    }

    handleUserFeed(change) {
        if (change.old_val && !change.new_val) {
            this.sock.emit('users:remove', change.old_val.username);
        }
        if (!change.old_val && change.new_val) {
            this.sock.emit('users:new', change.new_val.username);
        }
    }

    handleMessageFeed(change) {
        if (!change.old_val && change.new_val) {
            this.sock.emit('messages:new', change.new_val);
        }
    }
}

module.exports = ConnectionManager;