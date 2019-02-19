import {SET_IMG} from '../constants';

export default function ImageReducer(state = [], action) {
	switch (action.type) {
		case SET_IMG:
			return {
				...state,
				data: action.data
			};

		default:
			return state;
	}
}