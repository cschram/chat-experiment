"use strict";

let logger = require('./logger');
let Session = require('./session');
let config = require('../config.json');

const SERVER_ERROR = 'Unknown server error, please try again later.';

// This whole thing can really be refactored into a fuynction
class ConnectionManager {
    constructor(sock, db, feeds) {
        this.sock = sock;
        this.db = db;
        this.feeds = feeds;
        this.session = new Session(config.secret);
        this.listeners = {};

        sock.on('disconnect', () => {
            this.logout();
        });

        sock.on('auth:restore', (token, done) => {
            if (this.session.parse(token) && this.session.isAuthed()) {
                this.login(this.session.get('username'))
                    .then((state) => {
                        this.postLogin();
                        done(true, state);
                    })
                    .catch(err => done(false));
            } else {
                done(false);
            }
        });

        sock.on('auth:login', (username, done) => {
            this.login(username)
                .then((state) => {
                    this.postLogin();
                    done(null, {
                        token: this.session.getToken(),
                        state
                    });
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
        if (this.session.isAuthed()) {
            return Promise.reject(`Already logged in as "${this.session.get('username')}."`);
        } else {
            return this.db.loginUser(username).then(() => {
                logger.info(`New login from "${username}".`);
                this.session.set({
                    authed: true,
                    username
                });
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
        if (this.session.isAuthed()) {
            let username = this.session.get('username');
            logger.info(`User "${username}" logged out.`);
            this.db.logoutUser(username).catch(e => logger.error(e));
            Object.keys(this.listeners).forEach(feed => {
                this.feeds.removeListener(feed, this.listeners[feed]);
            });
            this.session.clear();
            this.sock.emit('auth:clear');
            this.listeners = {};
        }
    }

    postLogin() {
        this.subscribe('users', this.handleUserFeed.bind(this));
        this.subscribe('messages', this.handleMessageFeed.bind(this));
    }

    sendMessage(text) {
        if (!this.session.isAuthed()) {
            Promise.reject('You must be logged in.');
        } else {
            return this.db.sendMessage(this.session.get('username'),
                                       text);
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