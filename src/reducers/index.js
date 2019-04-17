import { combineReducers } from 'redux';
import HomeReducer from './HomeReducer';
import ImageReducer  from './ImageReducer';
import FixedEventsReducer from './FixedEventsReducer';
import NonFixedEventsReducer from './NonFixedEventsReducer';
import NavigationReducer from './NavigationReducer';
import ScheduleSelectionReducer from './ScheduleSelectionReducer';
import CoursesReducer from './CoursesReducer';
import CalendarReducer from './CalendarReducer';
import GeneratedNonFixedEventsReducer from './GeneratedNonFixedEventsReducer';
import UnavailableReducer from './UnavailableReducer';
import SchoolInformationReducer from './SchoolInformationReducer';
import GeneratedCalendarsReducer from './GeneratedCalendarsReducer';
import SettingsReducer from './SettingsReducer';
import BottomNavReducer from './BottomNavReducer';
import DashboardReducer from './DashboardReducer';

export default combineReducers( 
	{ 	
		HomeReducer, 
		ImageReducer, 
		FixedEventsReducer, 
		CoursesReducer, 
		NonFixedEventsReducer,  
		NavigationReducer, 
		ScheduleSelectionReducer, 
		UnavailableReducer,
		CalendarReducer,
		GeneratedNonFixedEventsReducer,
		SchoolInformationReducer,
		GeneratedCalendarsReducer,
		SettingsReducer,
		BottomNavReducer,
		DashboardReducer
	}
);
