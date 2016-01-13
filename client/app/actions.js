export const ACTION_TYPES = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    NEW_USER: 'NEW_USER',
    REMOVE_USER: 'REMOVE_USER',
    MESSAGE: 'MESSAGE'
};

export function login(username, state) {
    return {
        type: ACTION_TYPES.LOGIN,
        payload: {
            username,
            state
        }
    };
}

export function logout() {
    return {
        type: ACTION_TYPES.LOGOUT
    };
}

export function newUser(username) {
    return {
        type: ACTION_TYPES.NEW_USER,
        payload: username
    };
}

export function removeUser(username) {
    return {
        type: ACTION_TYPES.REMOVE_USER,
        payload: username
    };
}

export function newMessage(username, text) {
    return {
        type: ACTION_TYPES.MESSAGE,
        payload: {
            username,
            text
        }
    };
}