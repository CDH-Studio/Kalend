import { store } from '../store';
import { SET_NAV_SCREEN } from '../constants';

let updateNavigation = (screen, route) => {
	console.log(screen, " || ", route);
	store.dispatch({
		type: SET_NAV_SCREEN,
		screen,
		route
	});
};

export default updateNavigation;