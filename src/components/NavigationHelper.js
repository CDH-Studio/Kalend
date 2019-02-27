import { store } from '../store';
import { SET_NAV_SCREEN } from '../constants';

let updateNavigation = (screen, route) => {

	console.log(screen + ' ' + route);
	let nav = store.getState().NavigationReducer;

	if (screen === 'Home') {
		nav.main = 'Home';
	} else if (screen === 'WelcomeScreen') {
		nav.main = 'WelcomeScreen';
	} else if (screen === 'Dashboard') {
		nav.main = 'Dashboard';
	}  else if (screen === 'SchoolSchedule') {
		nav.main = 'SchoolSchedule';
	}

	store.dispatch({
		...nav,
		type: SET_NAV_SCREEN,
		screen,
		route,
		main: nav.main
	});
};

export default updateNavigation;