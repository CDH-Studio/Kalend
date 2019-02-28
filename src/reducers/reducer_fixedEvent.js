import {ADD_FE} from '../constants';

export default function FixedEventsReducer(state = [], action) {
	const { event } = action;
	switch (action.type) {
		case ADD_FE:
			return  [...state, event];

		default:
			return state;
	}
}