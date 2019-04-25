import React from 'react';
import { StatusBar, View, Animated, Easing, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import AnimatedGradient from '../AnimatedGradient';
import { WelcomeScreen, DashboardOptionsNavigator } from '../../constants/screenNames';
import { gradientColors } from '../../../config/config';
import { loadingStyles as styles, blue, statusBarDark } from '../../styles';
import { setBottomString, setLanguage } from '../../actions';
import { getStrings } from '../../services/helper';
import firebase from 'react-native-firebase';
import { requestCalendarPermissions } from '../../services/firebase_messaging';

const logoFile = require('../../assets/logoAnim.json');
const gradientAnimDuration = 2250;
const logoAnimDuration = 3000;

/**
 * The logo animation screen when the application is opened.
 */
class LoadingScreen extends React.PureComponent {

	notificationStrings = getStrings().SharingNotification;

	constructor(props) {
		super(props);
		this.state = {
			colors: [blue, blue],
			animProgress: new Animated.Value(0),
			nextScreen: WelcomeScreen
		};

		this.props.dispatch(setBottomString({
			dashboardTitle: getStrings().Dashboard.name, 
			chatbotTitle: getStrings().Chatbot.name, 
			compareTitle: getStrings().CompareSchedule.name, 
			settingsTitle: getStrings().Settings.name
		}));

		if (props.language === undefined) {
			this.props.dispatch(setLanguage('en'));
		}
		
		// Waits for the animation to finish, then goes to the next screen
		setTimeout(()=> {
			this.props.navigation.navigate(this.state.nextScreen);
		}, logoAnimDuration);
	}

	componentDidMount() {
		// Creates an animated value store at this.state.progress
		Animated.timing(this.state.animProgress, {
			toValue: 1,
			duration: gradientAnimDuration,
			easing: Easing.linear,
		}).start();

		// Sets the desired gradient, for it to be animated
		this.setState({
			colors: gradientColors
		});

		this.createNotificationListeners();
	}

	createNotificationListeners = async () => {
		/*
		* Triggered for data only payload in foreground
		* */
		this.messageListener = firebase.messaging().onMessage((message) => {
			Alert.alert(this.notificationStrings.title, message.data.name + this.notificationStrings.body, [
				{text: 'Allow', onPress: () => {
					requestCalendarPermissions({
						requester: {email: message.data.senderEmail},
						accepter : {email: message.data.receiverEmail}
					})
						.then(res => res.json())
						.then(success => {
							if(success) {
								firebase.database()
									.ref(`notifications/${message.from.split('/')[2]}/${message.data.notificationId}/`)
									.update({
										allow: true,
										dismiss: false
									});
								Alert.alert('', this.notificationStrings.allowBody, [{text: 'Ok'}], {cancelable: true});
							}
						});
				}
				},
				{text: 'Deny', onPress: () => {
					firebase.database()
						.ref(`notifications/${message.from.split('/')[2]}/${message.data.notificationId}/`)
						.update({
							allow: false,
							dismiss: false
						});
					Alert.alert('', this.notificationStrings.denyBody, [{text: 'Ok'}], {cancelable: true});
				}, style: 'cancel'}
			], {cancelable: true});
		});

		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const action = notificationOpen.action;
			const notification = notificationOpen.notification;

			if (action === 'allow' ||  action === 'deny') {
				firebase.notifications().removeDeliveredNotification(notification.notificationId);
			}
		});
	}

	showAlert(title, body) {
		Alert.alert(
			title, body,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false },
		);
	}

	componentWillMount() {
		// Checks which main screen was last accessed and changes
		// the next screen to that screen
		switch (this.props.main) {
			case 'Home':
				this.setState({
					nextScreen: WelcomeScreen
				});
				break;
			case 'SchoolSchedule':
				this.setState({
					nextScreen: DashboardOptionsNavigator,
				});
				break;
			case 'Dashboard':
				// Checks if the user is logged in, if so the next screen
				// is the dashboard, otherwise its the login screen
				if (this.props.profile !== null) {
					this.setState({
						nextScreen: DashboardOptionsNavigator
					});
				}
				break;
		}
	}

	render() {
		const { colors, animProgress } = this.state;
		return(
			<View style={styles.container}>
				<AnimatedGradient
					style={{ flex: 1,}}
					colors={colors}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}/>

				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={statusBarDark} />
				
				<View style={styles.animView}>
					<LottieView progress={animProgress}
						loop={false}
						source={logoFile}/>
				</View>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		main: state.NavigationReducer.main, 
		profile: state.HomeReducer.profile,
		language: state.SettingsReducer.language
	};
};

export default connect(mapStateToProps, null)(LoadingScreen);