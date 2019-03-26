import { CREATE_CALENDAR, CLEAR_CALENDAR, ADD_COLORS } from '../constants';

export default function CalendarReducer(state = [], action) {
	const { id, colors } = action;
	switch (action.type) {
		
		case CREATE_CALENDAR: 
			return {
				...state,
				id
			};

		case ADD_COLORS:
			return {
				...colors
			};

		case CLEAR_CALENDAR:
			return [];

		default:
			return state;
	}
}