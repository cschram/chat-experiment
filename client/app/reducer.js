import {ACTION_TYPES} from './actions';

const initialState = {
    currentUser: null,
    users: [],
    messages: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
    case ACTION_TYPES.PUSH_USERS:
        return Object.assign({}, state, {
            users: action.payload
        });
        break;
    case ACTION_TYPES.PUSH_MESSAGES:
        return Object.assign({}, state, {
            messages: action.payload
        });
        break;
    case ACTION_TYPES.LOGIN:
        return Object.assign({}, state, {
            currentUser: action.payload
        });
        break;
    case ACTION_TYPES.SEND_MESSAGE:
        return Object.assign({}, state, {
            messages: state.messages.concat([{
                username: state.currentUser,
                text: action.payload
            }])
        });
        break;
    default:
        return state;
    }
}
