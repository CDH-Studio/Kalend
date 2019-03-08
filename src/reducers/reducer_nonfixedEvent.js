import { ADD_NFE, CLEAR_NFE, DELETE_NFE, UPDATE_NFE } from '../constants';

export default function NonFixedEventsReducer(state = [], action) {
	const { event, index } = action;
	switch (action.type) {
		case ADD_NFE:
			return  [...state, event];

		case DELETE_NFE: 
			return event;

		case CLEAR_NFE:
			return [];

		case UPDATE_NFE:
			state.splice(index, 1, event);
			return [...state]; 
			
		default:
			return state;
	}
}