import { ADD_FE, CLEAR_FE, DELETE_FE, UPDATE_FE } from '../constants';

export default function FixedEventsReducer(state = [], action) {
	const { event, index } = action;

	switch (action.type) {
		case ADD_FE:
			return  [...state, event];

		case DELETE_FE:
			state.splice(index, 1);
			return [...state]; 

		case CLEAR_FE:
			return [];

		case UPDATE_FE:
			state.splice(index, 1, event);
			return [...state];
			
		default:
			return state;
	}
}