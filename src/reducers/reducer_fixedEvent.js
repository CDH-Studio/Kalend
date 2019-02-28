import {ADD_FE, ADD_COURSE} from '../constants';

export default function FixedEventsReducer(state = [], action) {
	const { event } = action;
	console.log(state);
	switch (action.type) {
		case ADD_FE:
			return  [...state, event];
		case ADD_COURSE: 
			return  [...state, event];

		default:
			return state;
	}
}