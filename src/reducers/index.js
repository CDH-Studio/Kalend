import { combineReducers } from 'redux';
import HomeReducer from './reducer_user';
import ImageReducer  from './reducer_image';
import FixedEventsReducer from './reducer_fixedEvent';
import NonFixedEventsReducer from './reducer_nonfixedEvent';

export default combineReducers( { HomeReducer, ImageReducer, FixedEventsReducer, NonFixedEventsReducer });