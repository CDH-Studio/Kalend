import { SET_LANGUAGE, CLEAR_SETTINGS } from '../constants';

export default function SettingsReducer(action, state = []) {
	const { language } = action;

	switch (action.type) {
		
		case SET_LANGUAGE: 
			return  {
				...state,
				language
			};

		case CLEAR_SETTINGS:
			return [];

		default:
			return state;
	}
}