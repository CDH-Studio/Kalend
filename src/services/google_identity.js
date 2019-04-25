import { GoogleSignin } from 'react-native-google-signin';
import { webClientId, googleIdentityScope } from '../../config/config';

GoogleSignin.configure({
	scopes: googleIdentityScope,
	webClientId,
	offlineAccess: true
});

let googleSignIn = async () => {
	try {
		await GoogleSignin.hasPlayServices();
		await GoogleSignin.signIn();
		const userInfo = await googleGetCurrentUserInfo();
		
		return userInfo;
	} catch (error) {
		return null;
	}
};

let googleSignOut = async () => {
	try {
		await GoogleSignin.signOut();
	} catch (error) {
		// console.error(error);
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
		//console.error(error);
	}
};

let getTokens =  async () => {
	return await GoogleSignin.getTokens();
};

module.exports = { googleSignIn, googleSignOut, googleRevokeAccess, googleIsSignedIn, googleGetCurrentUserInfo, getTokens };
