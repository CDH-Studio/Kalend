import {SIGNED_IN, SIGNED_OUT} from '../constants';

let user = {
	profile: null
}

export function HomeReducer(state = user, action) {
	switch (action.type) {
		case SIGNED_IN:
			const {profile} = action;
			user = {
				profile
			}
			
			return user;

		case SIGNED_OUT:
			user = {
				profile: null
			}
			return user;

		default:
			return state;
	}
}