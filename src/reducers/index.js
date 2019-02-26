import { combineReducers } from 'redux';
import HomeReducer from './reducer_user';
import ImageReducer  from './reducer_image';
import NavigationReducer from './reducer_navigation';


export default combineReducers( { HomeReducer, ImageReducer, NavigationReducer });