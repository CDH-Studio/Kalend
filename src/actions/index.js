import { UPDATE_NFE, SIGNED_IN, SIGNED_OUT, SET_IMG, ADD_FE, ADD_NFE, ADD_COURSE, DELETE_NFE, DELETE_FE, DELETE_COURSE, UPDATE_FE, UPDATE_COURSE } from '../constants';

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
export function setImageURI (ImageUri) {
	const action = {
		type: SET_IMG,
		data: ImageUri
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
export function deleteNonFixedEvent (event) {
	const action = {
		type: DELETE_NFE,
		event
	}; 

	return action;
}

export function deleteFixedEvent (event) {
	const action = {
		type: DELETE_FE,
		event
	}; 

	return action;
}

export function deleteCourse (event) {
	const action = {
		type: DELETE_COURSE,
		event
	}; 

	return action;
}
