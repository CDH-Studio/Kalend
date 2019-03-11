import { SIGNED_IN, SIGNED_OUT, SET_IMG, ADD_FE, ADD_NFE, ADD_COURSE, DELETE_NFE, DELETE_FE, DELETE_COURSE, SET_UNAVAILABLE_HOURS } from '../constants';

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

export function AddFixedEvent (event) {
	const action = {
		type: ADD_FE,
		event
	}; 

	return action;
}

export function AddCourseEvent (event) {
	const action = {
		type: ADD_COURSE,
		event
	}; 

	return action;
}

export function DeleteNonFixedEvent (event) {
	const action = {
		type: DELETE_NFE,
		event
	}; 

	return action;
}

export function DeleteFixedEvent (event) {
	const action = {
		type: DELETE_FE,
		event
	}; 

	return action;
}

export function DeleteCourseEvent (event) {
	const action = {
		type: DELETE_COURSE,
		event
	}; 

	return action;
}

export function AddNonFixedEvent (event) {
	const action = {
		type: ADD_NFE,
		event
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