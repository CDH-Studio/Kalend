import {ADD_EVENT, CLEAR_EVENTS} from '../constants/reducer_constants/allEvents';

export function clearAllEvents () {
	const action = {
		type: CLEAR_EVENTS
	};

	return action;
}

export function addEvents (event) {
	const action = {
		type: ADD_EVENT,
		event
	}; 

	return action;
}



