import firebase from 'react-native-firebase';
import uuid from 'uuid';

const apiHelperCall = (data) => {
	// Create a RemoteMessage
	const messagetUUID = uuid.v1();
	
	const message = new firebase.messaging.RemoteMessage()
		.setMessageId(messagetUUID)
		.setTo('359972006564@gcm.googleapis.com')
		.setData(data.body);

	console.log(message);

	// Send the message
	firebase.messaging().sendMessage(message).then((data) => console.log('data', data)).catch(err => console.log('erre', err));  
};

export const sendMessage = (data) => {
	apiHelperCall(data);
};


