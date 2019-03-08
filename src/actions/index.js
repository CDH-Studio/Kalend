import { SIGNED_IN, SIGNED_OUT, SET_IMG, ADD_FE, ADD_NFE, ADD_COURSE, DELETE_NFE, DELETE_FE, DELETE_COURSE, UPDATE_FE, UPDATE_COURSE } from '../constants';

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

export function setImageURI (ImageUri) {
	const action = {
		type: SET_IMG,
		data: ImageUri
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

export function addCourse (event) {
	const action = {
		type: ADD_COURSE,
		event
	}; 

	return action;
}

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

export function addNonFixedEvent (event) {
	const action = {
		type: ADD_NFE,
		event
	}; 

	return action;
}
