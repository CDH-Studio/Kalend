import {SET_OPENED} from '../constants';

export default function ImageReducer(state = [], action) {
	switch (action.type) {
		case SET_OPENED:
			return {
				...state,
				openedApp: action.openedApp,
			};
		default:
			return state;
	}
}