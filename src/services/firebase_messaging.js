import firebase from 'react-native-firebase';
import uuid from 'uuid';

const apiHelperCall = (data) => {
	// Create a RemoteMessage
	const messagetUUID = uuid.v1();
	
	const message = new firebase.messaging.RemoteMessage()
		.setMessageId(messagetUUID)
		.setTo(data.senderID + '@gcm.googleapis.com')
		.setData(data.body);

	// Send the message
	firebase.messaging().sendMessage(message);  
};

export const sendMessage = (data) => {
	apiHelperCall(data);
};


