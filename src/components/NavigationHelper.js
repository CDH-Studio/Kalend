import { setNavigationScreen } from '../actions';
import { store } from '../store';

let updateNavigation = (screen, route) => {
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

	store.dispatch(setNavigationScreen({
		...nav,
		screen,
		route,
	}));
};

export default updateNavigation;