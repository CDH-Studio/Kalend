import {ADD_FE, CLEAR_FE} from '../constants';

export default function FixedEventsReducer(state = [], action) {
	const { event } = action;
	console.log(state);
	switch (action.type) {
		case ADD_FE:
			return  [...state, event];
		case CLEAR_FE:
			return [];
		default:
			return state;
	}
}