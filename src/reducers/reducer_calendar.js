import { CREATE_CALENDAR, CLEAR_CALENDAR, ADD_COLORS, SET_FIXED_COLOR, SET_NONFIXED_COLOR, SET_COURSE_COLOR } from '../constants';

let calendar = {
	fixedEventsColor: '0', 
	nonFixedEventsColor: '3',
	courseColor: '1'
};

export default function CalendarReducer(state = calendar, action) {
	const { id, colors, fixedEventsColor, nonFixedEventsColor, courseColor } = action;

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

		default:
			return state;
	}
}