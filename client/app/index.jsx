import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, Link} from 'react-router';
import store from './store';
import history from './history';
import Chat from './views/chat.jsx';
import Login from './views/login.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
