import {ADD_GENERATED_CALENDAR, CLEAR_GENERATED_CALENDAR, DELETE_GENERATED_CALENDAR} from '../constants';

export default function GeneratedCalendarsReducer(action, state = []) {
	const { calendar, index } = action;
	switch (action.type) {

		case ADD_GENERATED_CALENDAR:
			return  [...state, calendar];

		case DELETE_GENERATED_CALENDAR:
			state.splice(index,1);
			return state;
			
		case CLEAR_GENERATED_CALENDAR:
			return [];
			
		default:
			return state;
	}
}