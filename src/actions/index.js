import { SET_NAV_SCREEN, SET_SELECTED_SCHEDULE, UPDATE_NFE, SIGNED_IN, SIGNED_OUT, SET_IMG, ADD_FE, ADD_NFE, ADD_COURSE, DELETE_NFE, DELETE_FE, DELETE_COURSE, UPDATE_FE, UPDATE_COURSE, SET_UNAVAILABLE_HOURS } from '../constants';

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
export function addFixedEvent (event) {
	const action = {
		type: ADD_FE,
		event
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

/*** SET ***/
export function setSelectedSchedule (index) {
	const action = {
		type: SET_SELECTED_SCHEDULE,
		index
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
		reviewEventSelected: data.reviewEventSelected
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