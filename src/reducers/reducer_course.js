import { ADD_COURSE, CLEAR_COURSE, DELETE_COURSE } from '../constants';

export default function CoursesReducer(state = [], action) {
	const { event } = action;
	switch (action.type) {
	
		case ADD_COURSE: 
			return  [...state, event];
		case DELETE_COURSE:
			return event;
		case CLEAR_COURSE: 
			return  [];

		default:
			return state;
	}
}