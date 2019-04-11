import { SET_SCHOOL_INFORMATION, CLEAR_SCHOOL_INFORMATION, GET_SCHOOL_INFORMATION } from '../constants';

let data = {
	info: null
};

export default function SchoolInformationReducer(action, state = data) {
	const info = action;

	switch (action.type) {
		case SET_SCHOOL_INFORMATION:
			data = {
				info
			};	
			return data;
		case GET_SCHOOL_INFORMATION:
			return data;

		case CLEAR_SCHOOL_INFORMATION:
			return {
				info: null
			};

		default:
			return state;
	}
}