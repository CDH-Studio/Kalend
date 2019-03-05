import {ADD_FE, CLEAR_FE, DELETE_FE} from '../constants';

export default function FixedEventsReducer(state = [], action) {
	const { event } = action;
	switch (action.type) {
		case ADD_FE:
			return  [...state, event];
		case DELETE_FE:
			return event;
		case CLEAR_FE:
			return [];
		default:
			return state;
	}
}