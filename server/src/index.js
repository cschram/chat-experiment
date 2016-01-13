"use strict";

let Server = require('socket.io');

let config = require('../config.json');
let logger = require('./logger');
let db = require('./db');
let FeedManager = require('./feed-manager');
let ConnectionManager = require('./connection-manager');

let dbConn;
let feedMgr;

db.connect(config.database).then((conn) => {
    logger.info('Connected to database.');
    dbConn = conn;
    feedMgr = new FeedManager(dbConn);
    return Promise.all([
        feedMgr.createFeed('users'),
        feedMgr.createFeed('messages')
    ]);
}).then(() => {
    logger.info('Setup database feeds.');
    let io = Server(config.server.port);
    logger.info('Started socket server.');

    io.on('connection', (sock) => {
        logger.info('New connection.');
        let connMgr = new ConnectionManager(sock, dbConn, feedMgr);
    });
}).catch((err) => {
    logger.error(err);
    process.exit();
});