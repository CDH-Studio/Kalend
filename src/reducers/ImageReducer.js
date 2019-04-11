import {SET_IMG, CLEAR_IMG} from '../constants';

export default function ImageReducer(action, state = []) {
	switch (action.type) {

		case SET_IMG:
			return {
				...state,
				data: action.data,
				hasImage: action.hasImage
			};

		case CLEAR_IMG:
			return [];
			
		default:
			return state;
	}
}