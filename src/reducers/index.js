import { combineReducers } from 'redux';
import HomeReducer from './reducer_user';
import ImageReducer  from './reducer_image';

export default combineReducers( { HomeReducer, ImageReducer });