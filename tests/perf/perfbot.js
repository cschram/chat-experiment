"use strict";

let minimist = require('minimist');
let winston = require('winston');
let io = require('socket.io-client');

let options = minimist(process.argv.slice(2), {
    string: ['url', 'username', 'interval', 'log'],
    default: {
        url: 'http://localhost:9000',
        username: 'PerfBot',
        interval: 5 * 1000,
        log: 'logs/PerfBot.log'
    }
});

function timestamp() {
    return (new Date).toUTCString();
}

let logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            json: false,
            timestamp: timestamp,
            prettyPrint: true
        }),
        new winston.transports.File({
            name: options.log,
            json: false,
            timestamp: timestamp,
            filename: options.log
        })
    ],
    exceptionHandlers: [
        new winston.transports.Console({
            colorize: true,
            json: false,
            timestamp: timestamp,
            prettyPrint: true
        }),
        new winston.transports.File({
            name: options.log,
            json: false,
            timestamp: timestamp,
            filename: options.log
        })
    ]
});

let socket = io(options.url);

socket.on('connect', () => logger.info(`Connected to ${options.url}`));
socket.on('disconnect', () => logger.info(`Disconnected from ${options.url}`));
socket.on('reconnect', () => logger.info(`Reconnected to ${options.url}`));
socket.on('reconnecting', () => logger.info(`Reconnecting to ${options.url}`));
socket.on('reconnect_failed', (err) => {
    logger.error(`Failed to reconnect to ${options.url}: ${err}`);
});
socket.on('error', err => logger.error(err));

function login(username) {
    return new Promise((resolve, reject) => {
        socket.emit('auth:login', username, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response.state);
            }
        });
    });
}

function sendMessage(text) {
    return new Promise((resolve, reject) => {
        socket.emit('messages:send', text, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

login(options.username).then(() => {
    logger.info(`Logged in as ${options.username}`);
    function send() {
        logger.info('Sending message');
        const t = Date.now();
        const text = timestamp();

        socket.on('messages:new', (msg) => {
            if (msg.text === text) {
                let duration = (Date.now() - t) / 1000;
                logger.info(`Message receival took ${duration}s`);
                socket.off('messages:new');
                setTimeout(send, options.interval);
            }
        });

        sendMessage(text).catch((err) => {
            logger.error(err);
            process.exit();
        });
    }
    setTimeout(send, options.interval);
}).catch((err) => {
    logger.error(err);
    process.exit();
});