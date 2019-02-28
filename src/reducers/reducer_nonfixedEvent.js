import {ADD_NFE} from '../constants';

export default function NonFixedEventsReducer(state = [], action) {
	switch (action.type) {
		case ADD_NFE:
			const { event } = action;
			return  [...state, event];

		default:
			return state;
	}
}