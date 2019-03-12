import {SET_SELECTED_SCHEDULE, CLEAR_SELECTED_SCHEDULE} from '../constants';

export default function ScheduleSelectionReducer(state = [], action) {
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
			
		default:
			return state;
	}
}