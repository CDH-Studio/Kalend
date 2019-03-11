import { combineReducers } from 'redux';
import HomeReducer from './reducer_user';
import ImageReducer  from './reducer_image';
import FixedEventsReducer from './reducer_fixedEvent';
import NonFixedEventsReducer from './reducer_nonfixedEvent';
import NavigationReducer from './reducer_navigation';
import StateReducer from './reducer_state';
import ScheduleSelectionReducer from './reducer_schedule';
import CoursesReducer from './reducer_course';
import CalendarReducer from './reducer_calendar';
import GeneratedNonFixedEventsReducer from './reducer_generatedNonFixedEvent';

export default combineReducers( 
	{ 	HomeReducer, 
		ImageReducer, 
		FixedEventsReducer, 
		CoursesReducer, 
		NonFixedEventsReducer,  
		NavigationReducer, 
		StateReducer, 
		ScheduleSelectionReducer,
		CalendarReducer,
		GeneratedNonFixedEventsReducer 
	});
