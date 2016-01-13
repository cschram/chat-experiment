import {ACTION_TYPES} from './actions';

const initialState = {
    currentUser: null,
    users: [],
    messages: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
    case ACTION_TYPES.LOGIN:
        return Object.assign({}, state, action.payload.state, {
            currentUser: action.payload.username
        });
        break;
    case ACTION_TYPES.LOGOUT:
        return Object.assign({}, state, {
            currentUser: null
        });
        break;
    case ACTION_TYPES.NEW_USER:
        return Object.assign({}, state, {
            users: state.users.concat([action.payload])
        });
        break;
    case ACTION_TYPES.REMOVE_USER:
        return Object.assign({}, state, {
            users: state.users.filter(user => user != action.payload)
        });
        break;
    case ACTION_TYPES.MESSAGE:
        return Object.assign({}, state, {
            messages: state.messages.concat([action.payload])
        });
        break;
    default:
        return state;
    }
}
