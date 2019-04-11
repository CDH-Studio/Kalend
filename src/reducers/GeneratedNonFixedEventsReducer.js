import {ADD_GENERATED_NFE, CLEAR_GENERATED_NFE} from '../constants';

export default function GeneratedNonFixedEventsReducer(action, state = []) {
	const { event } = action;
	switch (action.type) {

		case ADD_GENERATED_NFE:
			return  [...state, event];
			
		case CLEAR_GENERATED_NFE:
			return [];
			
		default:
			return state;
	}
}