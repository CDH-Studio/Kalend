import firebase from 'react-native-firebase';

const apiHelperCall = (data) => {
    // Create a RemoteMessage
    const message = new firebase.messaging.RemoteMessage()
    .setMessageId(data.id)
    .setTo(data.email)
    .setData(data.body);

    // Send the message
    firebase.messaging().sendMessage(message);  
}

export const sendMessage = (data) => {
    apiHelperCall(data);
}


