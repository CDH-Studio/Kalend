import firebase from 'react-native-firebase';
import uuid from 'react-native-uuid';

const apiHelperCall = (data) => {
    // Create a RemoteMessage
    const message = new firebase.messaging.RemoteMessage()
    var messagetUUID = uuid.v1();
    .setMessageId(messagetUUID)
    .setTo(data.senderID + '@gcm.googleapis.com')
    .setData(data.body);

    // Send the message
    firebase.messaging().sendMessage(message);  
}

export const sendMessage = (data) => {
    apiHelperCall(data);
}


