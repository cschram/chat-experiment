import Immutable from 'immutable';

const initialState = Immutable.Map({
    currentUser: null,
    users: [],
    messages: []
});

export const ACTION_TYPES = {
    // WebSocket pushed events
    PUSH_USERS: 'PUSH_USERS',
    PUSH_MESSAGES: 'PUSH_MESSAGES',

    // UI events
    LOGIN: 'LOGIN',
    NEW_MESSAGE: 'NEW_MESSAGE'
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.PUSH_USERS:
            return state.set('users', action.users);
            break;
        case ACTION_TYPES.PUSH_MESSAGES:
            return state.set('messages', action.messages);
            break;

        case ACTION_TYPES.LOGIN:
            return state.set('currentUser', action.username);
            break;
        case ACTION_TYPES.NEW_MESSAGE:
            return state.updateIn(['messages'], (messages) => messages.push(action.msg));
            break;

        default:
            return initialState;
    }
}