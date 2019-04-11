import { SET_SELECTED_SCHEDULE, CLEAR_SELECTED_SCHEDULE, CLEAR_SCHEDULE } from '../constants';

export default function ScheduleSelectionReducer(action, state = []) {
	switch (action.type) {

		case SET_SELECTED_SCHEDULE:
			return {
				...state,
				index: action.index,
			};
		case CLEAR_SELECTED_SCHEDULE:
			return {
				...state,
				index: null,
			};

		case CLEAR_SCHEDULE:
			return [];
			
		default:
			return state;
	}
}