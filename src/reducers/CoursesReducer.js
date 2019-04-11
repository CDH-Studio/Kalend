import { ADD_COURSE, CLEAR_COURSE, DELETE_COURSE, UPDATE_COURSE } from '../constants';

export default function CoursesReducer(action, state = []) {
	const { event, index } = action;

	switch (action.type) {
		case ADD_COURSE: 
			return  [...state, event];

		case DELETE_COURSE:
			state.splice(index, 1);
			return [...state]; 

		case CLEAR_COURSE: 
			return  [];

		case UPDATE_COURSE:
			state.splice(index, 1, event);
			return [...state]; 

		default:
			return state;
	}
}