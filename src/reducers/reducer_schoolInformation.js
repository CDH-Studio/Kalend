import { SET_SCHOOL_INFORMATION } from '../constants';

let data = {
	info: null
};

export default function SchoolInformationReducer(state = data, action) {
	const info = action;

	switch (action.type) {
		case SET_SCHOOL_INFORMATION:
			data = {
				info
			};	
			return data;

		default:
			return state;
	}
}