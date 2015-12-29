import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore); 
export default createStoreWithMiddleware(reducer);