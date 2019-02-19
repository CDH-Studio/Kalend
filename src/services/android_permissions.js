import { PermissionsAndroid } from 'react-native';

let requestStoragePermission = async () => {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
				title: 'Read Storage Permission',
				message:
				'Kalend needs access to storage in ' +
				'order to show you your camera roll.',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);
		
		return granted === PermissionsAndroid.RESULTS.GRANTED;
	} catch (err) {
		console.warn(err);
	}
};

let requestCamera = async () => {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA, {
				title: 'Camera Permission',
				message:
				'Kalend needs access to your camera to allow' +
				'you to take a picture of you schedule.',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);
		
		return granted === PermissionsAndroid.RESULTS.GRANTED;
	} catch (err) {
		console.warn(err);
	}
};

module.exports = { requestStoragePermission, requestCamera };