"use strict";

let Server = require('socket.io');

let config = require('../config.json');
let logger = require('./logger');
let db = require('./db');

const SERVER_ERROR = 'Unknown server error, please try again later.';

db.connect(config.database).then((conn) => {
    logger.info('Connected to database');

    let io = Server(config.server.port);

    io.on('connection', (sock) => {
        logger.info('New connection.');
        let username = null;

        sock.on('login', (name, done) => {
            if (username) {
                done(`Already logged in as "${username}."`);
            } else {
                conn.loginUser(name).then(() => {
                    logger.info(`New login from "${name}".`);
                    username = name;
                    done(null);
                }).catch((err) => {
                    if (typeof err === 'string') {
                        done(err);
                    } else {
                        logger.error(err);
                        done(SERVER_ERROR)
                    }
                });
            }
        });

        sock.on('disconnect', () => {
            if (username) {
                logger.info(`User "${username}" disconnected.`);
                conn.logoutUser(username).catch(e => logger.error(e));
                username = null;
            }
        });
    });
}).catch((err) => {
    logger.error(err);
    process.exit();
});