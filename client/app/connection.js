import io from 'socket.io-client';
import debug from 'debug';
import {server} from '../config.json';

const log = debug('connection');
const socket = io(`${server.host}:${server.port}`);

socket.on('connect', () => log('Connected'));
socket.on('disconnect', () => log('Disconnected'));
socket.on('reconnect', () => log('Reconnected'));
socket.on('reconnecting', () => log('Reconnecting...'));
socket.on('reconnect_failed', (err) => log('Reconnect failed: %s', err));
socket.on('error', err => log(err));

export function subscribe(event, fn) {
    socket.on(event, fn);
}

export function login(username) {
    return new Promise((resolve, reject) => {
        socket.emit('login', username, (error, state) => {
            if (error) {
                reject(error);
            } else {
                resolve(state);
            }
        });
    });
}

export function sendMessage(text) {
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

export default {
    subscribe,
    login,
    sendMessage
};