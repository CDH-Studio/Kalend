import firebase from 'react-native-firebase';
import { dark_blue } from '../styles';
import { getStrings } from '../services/helper';

export default async (notificationOpen) => {

	let strings = getStrings().SharingNotification;

	let notification = notificationOpen.notification;

	if (notificationOpen.action === 'allow') {
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

		firebase.notifications()
			.displayNotification(newNotification);
	} else if (notificationOpen.action === 'deny') {
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
		
		firebase.notifications()
			.displayNotification(newNotification);
	}

	return Promise.resolve();
};