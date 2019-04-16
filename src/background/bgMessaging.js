import firebase from 'react-native-firebase';
import { dark_blue } from '../styles';
import { getStrings } from '../services/helper';

export default async (message) => {

	const strings = getStrings().SharingNotification;
	// Creates buttons to the notification
	const allow = new firebase.notifications.Android.Action('allow', 'ic_launcher', strings.allow);
	const deny = new firebase.notifications.Android.Action('deny', 'ic_launcher', strings.deny);
	allow.setShowUserInterface(false);
	deny.setShowUserInterface(false);

	// Creates a channel for the android notification
	const channel = new firebase.notifications.Android.Channel('sharing-schedule', 'Sharing Schedules', firebase.notifications.Android.Importance.Max)
		.setDescription('Receive sharing request from other users');
	firebase.notifications().android.createChannel(channel);

	const localNotification = new firebase.notifications.Notification({
		sound: 'default',
		show_in_foreground: true,
	})
		.setNotificationId(message.data.notificationId)
		.setTitle(strings.title)
		.setBody(message.data.name + strings.body)
		.setSubtitle(strings.subtitle)
		.setData({
			email: message.data.email 
			path: message.from.split('/')[2]
		})
		.android.addAction(allow)
		.android.addAction(deny)
		.android.setAutoCancel(true)
		.android.setClickAction('prompt')
		.android.setChannelId(message.data.type)
		.android.setSmallIcon('ic_icon')
		.android.setColor(dark_blue)
		.android.setColorized(true)
		.android.setPriority(firebase.notifications.Android.Priority.High);

	firebase.notifications()
		.displayNotification(localNotification)
		.catch(err => console.log('Notification err ', err));

	return Promise.resolve();
};