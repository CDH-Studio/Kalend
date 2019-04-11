import { SIGNED_IN, SIGNED_OUT } from '../constants';

let user = {
	profile: null
};

export default function HomeReducer(state = user, action) {
	const profile = action;

	switch (action.type) {
		case SIGNED_IN:
			user = {
				profile
			};	
			return user;

		case SIGNED_OUT:
			return {
				profile: null
			};

		default:
			return state;
	}
}