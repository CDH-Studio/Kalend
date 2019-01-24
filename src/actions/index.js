import {SIGNED_IN, SIGNED_OUT,} from '../constants';

export function logUser(profile) {
	const action = {
		type: SIGNED_IN,
		profile
	}
	
	return action;
}

export function unlogUser() {
	const action = {
		type: SIGNED_OUT
	}

	return action;
}
