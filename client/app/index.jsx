import debug from 'debug';
debug.enable('init');
debug.enable('connection');
const log = debug('init');

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, Link} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import store from './store';
import history from './history';
import {login, newUser, removeUser, newMessage} from './actions';
import {subscribe, restoreSession} from './connection';
import {getToken, clearToken} from './session';
import Chat from './views/chat.jsx';
import Login from './views/login.jsx';

// Redirect the user to the login page if they are not logged in
function requireAuth(nextState, replaceState) {
    if (!store.getState().currentUser)
        replaceState(null, '/login');
}

// Redirect the user on the login page if they are already logged in
function loginRedirect(nextState, replaceState) {
    if (store.getState().currentUser)
        replaceState(null, '/');
}


function init() {
    subscribe('users:new', user => store.dispatch(newUser(user)));
    subscribe('users:remove', user => store.dispatch(removeUser(user)));
    subscribe('messages:new', msg => store.dispatch(newMessage(msg.username, msg.text)));

    render((
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={Chat}
                       onEnter={requireAuth} />
                <Route path="/login" component={Login}
                       onEnter={loginRedirect} />
            </Router>
        </Provider>
    ), document.getElementById('main'));
}

let token = getToken();
if (token) {
    restoreSession(token).then((res) => {
        let {username, state} = res;
        state.users = state.users.map(user => user.username);
        log(`Restored state for ${username}`);
        store.dispatch(login(username, state));
        init();
    }).catch(() => {
        clearToken();
        init();
    });
} else {
    init();
}