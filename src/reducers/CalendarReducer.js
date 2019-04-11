import { CREATE_CALENDAR, CLEAR_CALENDAR, ADD_COLORS, SET_FIXED_COLOR, SET_NONFIXED_COLOR, SET_COURSE_COLOR, SET_CALENDAR_COLOR } from '../constants';

let calendar = {
	fixedEventsColor: '4', 
	nonFixedEventsColor: '1',
	courseColor: '2'
};

export default function CalendarReducer(action, state = calendar) {
	const { id, colors, fixedEventsColor, nonFixedEventsColor, courseColor, calendarColor } = action;

	switch (action.type) {

		case CREATE_CALENDAR:
			return {
				...state,
				id
			};

		case ADD_COLORS:
			return {
				...state,
				colors
			};

		case SET_FIXED_COLOR:
			return {
				...state,
				fixedEventsColor
			};

		case SET_NONFIXED_COLOR:
			return {
				...state,
				nonFixedEventsColor
			};

		case SET_COURSE_COLOR:
			return {
				...state,
				courseColor
			};

		case CLEAR_CALENDAR:
			return {
				...calendar
			};

		case SET_CALENDAR_COLOR:
			return {
				...state,
				calendarColor,
			};

		default:
			return state;
	}
}