import {SET_UNAVAILABLE_HOURS} from '../constants';

let data = {
	info: null
};

export default function UnavailableReducer(state = data, action) {
	const info = action;

	switch (action.type) {
		case SET_UNAVAILABLE_HOURS:
			data = {
				info
			};	
			return data;

		default:
			return state;
	}
}