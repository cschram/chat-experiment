"use strict";

let path = require('path');
let winston = require('winston');
let config = require('./config');

function timestamp() {
    return (new Date).toUTCString();
}

module.exports = new winston.Logger({
    transports: [
    new winston.transports.Console({
      colorize    : true,
      json        : false,
      timestamp   : timestamp,
      prettyPrint : true
    }),
    new winston.transports.File({
      name      : 'server.debug.log',
      json      : false,
      timestamp : timestamp,
      filename  : path.resolve('logs/server.debug.log')
    }),
    new winston.transports.File({
      name      : 'server.debug.json',
      json      : true,
      timestamp : true,
      filename  : path.resolve('logs/server.debug.json')
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      json        : false,
      timestamp   : timestamp,
      prettyPrint : true
    }),
    new winston.transports.File({
      name      : 'server.error.log',
      json      : false,
      timestamp : timestamp,
      filename  : path.resolve('logs/server.error.log')
    }),
    new winston.transports.File({
      name      : 'server.error.json',
      json      : true,
      timestamp : timestamp,
      filename  : path.resolve('logs/server.error.json')
    })
  ]
});