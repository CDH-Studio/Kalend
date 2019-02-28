import {ADD_NFE} from '../constants';

export default function NonFixedEventsReducer(state = [], action) {
	const { event } = action;
	switch (action.type) {
		case ADD_NFE:
			return  [...state, event];

		default:
			return state;
	}
}