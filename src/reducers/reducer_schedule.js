import {SET_SELECTED_SCHEDULE} from '../constants';

export default function ScheduleSelectionReducer(state = [], action) {
	switch (action.type) {
		case SET_SELECTED_SCHEDULE:
			return {
				...state,
				index: action.index,
			};
		default:
			return state;
	}
}