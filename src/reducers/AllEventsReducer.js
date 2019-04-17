import { ADD_EVENT, CLEAR_EVENTS } from '../constants/reducer_constants/allEvents';

export default function AllEventsReducer(state = [], action) {
	const { event } = action;

	switch (action.type) {
		case ADD_EVENT:
			return  [...state, event];
			
		case CLEAR_EVENTS:
			return [];

		default:
			return state;
	}
}