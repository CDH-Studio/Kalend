import { SET_BOTTOM_STRINGS, CLEAR_BOTTOM_STRINGS } from '../constants';

export default function BottomNavReducer(state = [], action) {
	switch (action.type) {
		case SET_BOTTOM_STRINGS:
			return {
				...action.params
			};
		
		case CLEAR_BOTTOM_STRINGS:
			return [];

		default:
			return state;
	}
}