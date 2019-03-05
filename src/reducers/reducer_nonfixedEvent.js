import {ADD_NFE, CLEAR_NFE, DELETE_NFE} from '../constants';

export default function NonFixedEventsReducer(state = [], action) {
	const { event } = action;
	switch (action.type) {

		case ADD_NFE:
			return  [...state, event];
		case DELETE_NFE: 
			return event;
		case CLEAR_NFE:
			return [];
			
		default:
			return state;
	}
}