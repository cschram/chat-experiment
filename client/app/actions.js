export const ACTION_TYPES = {
    // WebSocket pushed events
    PUSH_USERS: 'PUSH_USERS',
    PUSH_MESSAGES: 'PUSH_MESSAGES',

    // UI events
    LOGIN: 'LOGIN',
    SEND_MESSAGE: 'SEND_MESSAGE'
};

export function pushUsers(users) {
    return {
        type: ACTION_TYPES.PUSH_USERS,
        payload: users
    };
}

export function pushMessages(messages) {
    return {
        type: ACTION_TYPES.PUSH_MESSAGES,
        payload: messages
    };
}

export function login(username) {
    return {
        type: ACTION_TYPES.LOGIN,
        payload: username
    };
}

export function sendMessage(text) {
    return {
        type: ACTION_TYPES.SEND_MESSAGE,
        payload: text
    };
}