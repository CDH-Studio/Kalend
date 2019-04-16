import firebase from 'react-native-firebase';
import { dark_blue } from '../styles';
import { getStrings } from '../services/helper';

export default async (notificationOpen) => {

	let strings = getStrings().SharingNotification;
	let action = notificationOpen.action;

	let notification = notificationOpen.notification;

	if (action === 'allow') {
		let newNotification = new firebase.notifications.Notification({
			sound: 'default',
			show_in_foreground: true,
		})
			.setNotificationId(notification.notificationId)
			.setSubtitle(notification.subtitle)
			.setTitle(notification.title)
			.setBody(strings.allowBody)
			.android.setAutoCancel(true)
			.android.setClickAction('clicked')
			.android.setChannelId(notification.android.channelId)
			.android.setSmallIcon('ic_icon')
			.android.setColor(dark_blue)
			.android.setColorized(true)
			.android.setTimeoutAfter(2000)
			.android.setPriority(firebase.notifications.Android.Priority.High);

		firebase.database()
			.ref(`notifications/${notification.data.path}/${notification.notificationId}/`)
			.update({
				allow: true,
				dismiss: false
			});

		firebase.notifications()
			.displayNotification(newNotification);
	} else if (action === 'deny') {
		let newNotification = new firebase.notifications.Notification({
			sound: 'default',
			show_in_foreground: true,
		})
			.setNotificationId(notification.notificationId)
			.setSubtitle(notification.subtitle)
			.setTitle(notification.title)
			.setBody(strings.denyBody)
			.android.setAutoCancel(true)
			.android.setClickAction('clicked')
			.android.setChannelId(notification.android.channelId)
			.android.setSmallIcon('ic_icon')
			.android.setColor(dark_blue)
			.android.setColorized(true)
			.android.setTimeoutAfter(2000)
			.android.setPriority(firebase.notifications.Android.Priority.High);
		
		
		firebase.database()
			.ref(`notifications/${notification.data.path}/${notification.notificationId}/`)
			.update({
				allow: false,
				dismiss: false
			});
		
		firebase.notifications()
			.displayNotification(newNotification);
	} else if (action === 'prompt') {
		firebase.database()
			.ref(`notifications/${notification.data.path}/${notification.notificationId}/`)
			.update({
				dismiss: true
			});
	}

	return Promise.resolve();
};