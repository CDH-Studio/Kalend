import { store } from '../store';
import { SET_NAV_SCREEN } from '../constants';

let updateNavigation = (screen, route) => {
	console.log(screen, " || ", route);
	let main = store.getState().NavigationReducer.main;

	if (screen === 'Home') {
		main = 'Home';
	} else if (screen === 'WelcomeScreen') {
		main = 'WelcomeScreen';
	} else if (screen === 'Dashboard') {
		main = 'Dashboard';
	}

	store.dispatch({
		type: SET_NAV_SCREEN,
		screen,
		route,
		main
	});
};

export default updateNavigation;