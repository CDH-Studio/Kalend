import { SET_NAV_SCREEN, CLEAR_NAV_SCREEN } from '../constants';

let nav = {
	screen: null,
	route: null,
	main: null,
	routes: null,
	reviewEventSelected: null,
	successfullyInsertedEvents: null
};

export default function NavigationReducer(state = nav, action) {
	switch (action.type) {
		case SET_NAV_SCREEN:
			return {
				screen: action.screen,
				route: action.route,
				main: action.main,
				routes: action.routes,
				reviewEventSelected: action.reviewEventSelected,
				successfullyInsertedEvents: action.successfullyInsertedEvents
			};
		
		case CLEAR_NAV_SCREEN:
			return [];

		default:
			return state;
	}
}