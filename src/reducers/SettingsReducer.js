import { SET_LANGUAGE, CLEAR_SETTINGS, SET_TUTORIAL_STATUS, CLEAR_TUTORIAL_STATUS } from '../constants';

let defaultState = {
	tutorialStatus: {
		dashboard: false,
		reviewEvents: false,
		compareSchedule: false
	}
};

export default function SettingsReducer(state = defaultState, action) {
	const { language } = action;

	switch (action.type) {
		
		case SET_LANGUAGE: 
			return  {
				...state,
				language
			};

		case SET_TUTORIAL_STATUS:
			return {
				...state,
				tutorialStatus: {
					...state.tutorialStatus,
					[action.tutorialScreen]: action.tutorialValue
				}
			};

		case CLEAR_TUTORIAL_STATUS:
			return {
				...state,
				tutorialStatus: defaultState.tutorialStatus
			};

		case CLEAR_SETTINGS:
			return [];

		default:
			return state;
	}
}