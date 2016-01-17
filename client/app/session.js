const TOKEN_ITEM_NAME = 'token';

export function getToken() {
    return sessionStorage.getItem(TOKEN_ITEM_NAME);
}

export function setToken(token) {
    sessionStorage.setItem(TOKEN_ITEM_NAME, token);
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_ITEM_NAME);
}

export default {
    getToken,
    setToken,
    clearToken
}