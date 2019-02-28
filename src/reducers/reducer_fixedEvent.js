import {ADD_FE} from '../constants';

export default function FixedEventsReducer(state = [], action) {
	switch (action.type) {
		case ADD_FE:
			const { event } = action;
			console.log('before', state);
			return  [...state, event];

		default:
			return state;
	}
}