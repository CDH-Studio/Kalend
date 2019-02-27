import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { webClientId, googleIdentityScope } from '../../config';

GoogleSignin.configure({
	scopes: googleIdentityScope,
	webClientId,
	offlineAccess: true
});

let googleSignIn = async () => {
	try {
		console.log(1);
		await GoogleSignin.hasPlayServices();
		console.log(2);
		const userInfo = await GoogleSignin.signIn();
		console.log(3);
		return userInfo;
	} catch (error) {
		console.log(30606);
		return null;
	}
};

let googleSignOut = async () => {
	try {
		await GoogleSignin.revokeAccess();
		await GoogleSignin.signOut();
	} catch (error) {
		console.error(error);
	}
};

let googleRevokeAccess = async () => {
	try {
		await GoogleSignin.revokeAccess();
	} catch (error) {
		//console.error(error);
	}
};

let googleIsSignedIn = async () => {
	const isSignedIn = await GoogleSignin.isSignedIn();
	return isSignedIn;
};

let googleGetCurrentUserInfo = async () => {
	try {
		const userInfo = await GoogleSignin.signInSilently();
		return userInfo;
	} catch (error) {
		if (error.code === statusCodes.SIGN_IN_REQUIRED) {
			// user has not signed in yet
		} else {
			// some other error
		}
	}
};

module.exports = { googleSignIn, googleSignOut, googleRevokeAccess, googleIsSignedIn, googleGetCurrentUserInfo };
