import { 
	SET_NAV_SCREEN, 
	SET_SELECTED_SCHEDULE, 
	SET_UNAVAILABLE_HOURS,
	SET_SCHOOL_INFORMATION,
	SET_LANGUAGE,
	SET_BOTTOM_STRINGS,
	SET_IMG, 
	SET_DASHBOARD_DATA,
	SET_NONFIXED_COLOR,
	SET_COURSE_COLOR,
	SET_FIXED_COLOR,
	SET_CALENDAR_COLOR,
	CREATE_CALENDAR,
	SIGNED_IN, 
	SIGNED_OUT, 
	ADD_FE, 
	ADD_GENERATED_NFE,
	ADD_GENERATED_CALENDAR,
	ADD_NFE, 
	ADD_COURSE, 
	ADD_COLORS,
	DELETE_NFE, 
	DELETE_FE, 
	DELETE_COURSE,
	DELETE_GENERATED_CALENDAR, 
	UPDATE_FE, 
	UPDATE_NFE, 
	UPDATE_COURSE, 
	CLEAR_GENERATED_CALENDAR,
	CLEAR_CALENDAR,
	CLEAR_COURSE,
	CLEAR_GENERATED_NFE,
	CLEAR_FE,
	CLEAR_NFE,
	CLEAR_NAV_SCREEN,
	CLEAR_SCHEDULE,
	CLEAR_SCHOOL_INFORMATION,
	CLEAR_UNAVAILABLE_HOURS,
	CLEAR_OPENED,
	CLEAR_SETTINGS,
	CLEAR_BOTTOM_STRINGS,
	CLEAR_DASHBOARD_DATA,
} from '../constants';


/*** UPDATE ***/
export function updateFixedEvents (index, event) {
	const action = {
		type: UPDATE_FE,
		event, 
		index
	};

	return action;
}

export function updateCourses (index, event) {
	const action = {
		type: UPDATE_COURSE,
		event, 
		index
	};

	return action;
}

export function updateNonFixedEvents (index, event) {
	const action = {
		type: UPDATE_NFE,
		event, 
		index
	};

	return action;
}

/*** USER ***/
export function logonUser (profile) {
	const action = {
		type: SIGNED_IN,
		profile
	};

	return action;
}

export function logoffUser () {
	const action = {
		type: SIGNED_OUT
	};

	return action;
}

/*** IMAGE ***/
export function setImageURI (data, hasImage) {
	const action = {
		type: SET_IMG,
		data, 
		hasImage
	}; 

	return action;
}

/*** ADD ***/
export function addColors (colors) {
	const action = {
		type: ADD_COLORS, 
		colors
	};

	return action;
}

export function addFixedEvent (event) {
	const action = {
		type: ADD_FE,
		event
	}; 

	return action;
}

export function addGeneratedNonFixedEvent (event) {
	const action = {
		type: ADD_GENERATED_NFE,
		event
	}; 

	return action;
}

export function addGeneratedCalendar (calendar) {
	const action = {
		type: ADD_GENERATED_CALENDAR,
		calendar
	}; 

	return action;
}

export function addCourse (event) {
	const action = {
		type: ADD_COURSE,
		event
	}; 

	return action;
}

export function addNonFixedEvent (event) {
	const action = {
		type: ADD_NFE,
		event
	}; 

	return action;
}

/*** DELETE ***/
export function deleteNonFixedEvent (index) {
	const action = {
		type: DELETE_NFE,
		index
	}; 

	return action;
}



export function deleteFixedEvent (index) {
	const action = {
		type: DELETE_FE,
		index
	}; 

	return action;
}

export function deleteCourse (index) {
	const action = {
		type: DELETE_COURSE,
		index
	}; 

	return action;
}

export function deleteGeneratedCalendar(index) {
	const action = {
		type: DELETE_GENERATED_CALENDAR,
		index
	};

	return action;
}

/*** SET ***/
export function setSelectedSchedule (index) {
	const action = {
		type: SET_SELECTED_SCHEDULE,
		index
	};

	return action;
}

export function setCalendarID (id) {
	const action = {
		type: CREATE_CALENDAR,
		id
	}; 

	return action;
}

export function setNavigationScreen (data) {
	const action = {
		type: SET_NAV_SCREEN,
		screen: data.screen,
		route: data.route,
		main: data.main,
		routes: data.routes,
		reviewEventSelected: data.reviewEventSelected,
		successfullyInsertedEvents: data.successfullyInsertedEvents
	};

	return action;
}
    
export function setUnavailableHours (info) {
	const action = {
		type: SET_UNAVAILABLE_HOURS,
		info
	};

	return action;
}

export function setSchoolInformation (info) {
	const action = {
		type: SET_SCHOOL_INFORMATION,
		info
	};

	return action;
}

export function setLanguage (language) {
	const action = {
		type: SET_LANGUAGE,
		language
	};

	return action;
}
export function setDashboardData (data) {
	const action = {
		type: SET_DASHBOARD_DATA,
		data
	};

	return action;
}

export function setBottomString (params) {
	const action = {
		type: SET_BOTTOM_STRINGS,
		params
	};

	return action;
}

export function setFixedColor (fixedEventsColor) {
	const action = {
		type: SET_FIXED_COLOR,
		fixedEventsColor
	};

	return action;
}

export function setNonFixedColor (nonFixedEventsColor) {
	const action = {
		type: SET_NONFIXED_COLOR,
		nonFixedEventsColor
	};

	return action;
}

export function setCourseColor (courseColor) {
	const action = {
		type: SET_COURSE_COLOR,
		courseColor
	};

	return action;
}

export function setCalendarColor (calendarColor) {
	const action = {
		type: SET_CALENDAR_COLOR,
		calendarColor
	};

	return action;
}

/*** CLEAR ***/
export function clearCalendarID () {
	const action = {
		type: CLEAR_CALENDAR
	};

	return action;
}

export function clearCourse () {
	const action = {
		type: CLEAR_COURSE
	};

	return action;
}

export function clearFixedEvents () {
	const action = {
		type: CLEAR_FE
	};

	return action;
}

export function clearNonFixedEvents () {
	const action = {
		type: CLEAR_NFE
	};

	return action;
}

export function clearGeneratedNonFixedEvents () {
	const action = {
		type: CLEAR_GENERATED_NFE
	};

	return action;
}

export function clearGeneratedCalendars () {
	const action = {
		type: CLEAR_GENERATED_CALENDAR
	}; 

	return action;
}

export function clearNavigation () {
	const action = {
		type: CLEAR_NAV_SCREEN
	};

	return action;
}

export function clearSchedule () {
	const action = {
		type: CLEAR_SCHEDULE
	};

	return action;
}

export function clearDashboardData () {
	const action = {
		type: CLEAR_DASHBOARD_DATA
	};

	return action;
}

export function clearSchoolInformation () {
	const action = {
		type: CLEAR_SCHOOL_INFORMATION
	};

	return action;
}

export function clearState () {
	const action = {
		type: CLEAR_OPENED
	};

	return action;
}

export function clearUnavailableHours () {
	const action = {
		type: CLEAR_UNAVAILABLE_HOURS
	};

	return action;
}

export function clearLanguage () {
	const action = {
		type: CLEAR_SETTINGS
	};

	return action;
}

export function clearBottomString () {
	const action = {
		type: CLEAR_BOTTOM_STRINGS
	};

	return action;
}