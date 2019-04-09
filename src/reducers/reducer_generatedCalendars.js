import {ADD_GENERATED_CALENDAR, CLEAR_GENERATED_CALENDAR, DELETE_GENERATED_CALENDAR, SET_SELECTED_CALENDAR} from '../constants';

export default function GeneratedCalendarsReducer(state = [], action) {
	const { calendar, index } = action;
	switch (action.type) {

		case ADD_GENERATED_CALENDAR:
			return  [...state, calendar];

		case DELETE_GENERATED_CALENDAR:
			state.splice(index,1);
			return state;
			
		case CLEAR_GENERATED_CALENDAR:
			return [];
			
		case SET_SELECTED_CALENDAR:
			state[index].selected = true;
			return state;
		default:
			return state;
	}
}