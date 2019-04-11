import { SET_UNAVAILABLE_HOURS, CLEAR_UNAVAILABLE_HOURS } from '../constants';

let data = {
	info: null
};

export default function UnavailableReducer(action, state = data) {
	const info = action;

	switch (action.type) {
		case SET_UNAVAILABLE_HOURS:
			data = {
				info
			};	
			return data;

		case CLEAR_UNAVAILABLE_HOURS:
			return {
				info: null
			};

		default:
			return state;
	}
}