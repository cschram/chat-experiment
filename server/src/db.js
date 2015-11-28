"use strict";

let r = require('rethinkdb');

class DBConnection {
    constructor(config) {
        this._config = config;
    }

    connect() {
        return r.connect(this._config).then((conn) => {
            this.conn = conn;
            return this;
        });
    }

    getUser(username) {
        return r.table('users').get(username).run(this.conn);
    }

    loginUser(username) {
        return this.getUser(username).then(() => {
            throw `User "${username}" already exists.`;
        }).catch(() => {
            return r.table('users').insert({
                username: name,
                game: null,
                score: 0,
                cards: []
            }).run(this.conn);
        });
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