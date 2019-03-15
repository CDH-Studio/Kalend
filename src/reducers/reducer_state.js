import { SET_OPENED, CLEAR_OPENED } from '../constants';

export default function ImageReducer(state = [], action) {
	switch (action.type) {

		case SET_OPENED:
			return {
				...state,
				openedApp: action.openedApp,
			};

		case CLEAR_OPENED:
			return [];
			
		default:
			return state;
	}
}