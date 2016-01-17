"use strict";

let r = require('rethinkdb');
let logger = require('./logger');

class DBConnection {
    constructor(config) {
        this._config = config;
    }

    connect() {
        return r.connect(this._config).then((conn) => {
            this.conn = conn;
            // Clear active users
            return r.table('users').delete().run(conn);
        }).then(() => this);
    }

    getUser(username) {
        return r.table('users')
                .get(username)
                .run(this.conn);
    }

    getUsers() {
        return r.table('users')
                .run(this.conn)
                .then(cursor => cursor.toArray());
    }

    loginUser(username) {
        return this.getUser(username).then((user) => {
            if (user) {
                throw `Username "${username}" is taken.`;
            } else {
                return r.table('users').insert({
                    username: username
                }).run(this.conn);  
            }
        });
    }

    logoutUser(username) {
        return r.table('users')
                .get(username)
                .delete()
                .run(this.conn);
    }

    getMessages() {
        return r.table('messages')
                .orderBy('timestamp')
                .run(this.conn)
                .then(cursor => cursor.toArray());
    }

    sendMessage(username, text) {
        return r.table('messages')
                .insert({
                    username: username,
                    text: text,
                    timestamp: r.now()
                })
                .run(this.conn);
    }

    getTableFeed(table) {
        return r.table(table)
                .changes({ includeInitial: true })
                .run(this.conn);
    }
}

function connect(config) {
    let conn = new DBConnection(config);
    return conn.connect();
};

module.exports = {
    DBConnection: DBConnection,
    connect: connect
};