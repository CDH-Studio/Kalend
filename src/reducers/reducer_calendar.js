import { CREATE_CALENDAR, CLEAR_CALENDAR } from '../constants';

export default function CalendarReducer(state = [], action) {
	const { id } = action;
	switch (action.type) {
		
		case CREATE_CALENDAR: 
			return  {
				...state,
				id
			};

		case CLEAR_CALENDAR:
			return [];

		default:
			return state;
	}
}