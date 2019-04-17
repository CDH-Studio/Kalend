import { SET_DASHBOARD_DATA, CLEAR_DASHBOARD_DATA} from '../constants';

export default function DashboardReducer(state = {}, action) {
	const { data } = action;

	switch (action.type) {
		case SET_DASHBOARD_DATA: 
			return  data;

		case CLEAR_DASHBOARD_DATA: 
			return  {};

		default:
			return state;
	}
}