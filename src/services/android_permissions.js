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

module.exports = { requestStoragePermission };