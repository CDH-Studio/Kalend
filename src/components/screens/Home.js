import React from 'react';
import { ImageBackground, StatusBar, View, Image, Text, Linking, TouchableOpacity, Platform } from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { setCalendarID, logonUser, setBottomString, setCalendarColor } from '../../actions';
import { DashboardNavigator } from '../../constants/screenNames';
import { gradientColors } from '../../../config/config';
import updateNavigation from '../NavigationHelper';
import { bindActionCreators } from 'redux';
import { googleSignIn, googleIsSignedIn, googleGetCurrentUserInfo } from '../../services/google_identity';
import { createCalendar, getCalendarID2 } from '../../services/service';
import { homeStyles as styles } from '../../styles';
import { getStrings } from '../../services/helper';

/** 
 * Home/Login screen of the app.
 * Permits the user to log into the app with their Google account.
 */
class Home extends React.PureComponent {

	strings = getStrings().Home;

	constructor(props) {
		super(props);
		this.state = {
			clicked: false
		};
		updateNavigation('Home', props.navigation.state.routeName);
	}

	/**
	 * Sets the user information
	 */
	setUser = (userInfo) => {
		this.props.logonUser(userInfo);	
	}

	/**
	 * Creates the Kalend calendar in the user's Google Account
	 */
	setCalendar() {
		getCalendarID2().then(data => {
			if (data.calendarID === undefined) {
				createCalendar().then(data => {
					this.props.setCalendarID(data.calendarID);
					this.props.setCalendarColor(data.calendarColor);
					this.props.navigation.navigate(DashboardNavigator);
				});
			} else {
				this.props.setCalendarID(data.calendarID);
				this.props.setCalendarColor(data.calendarColor);
				this.props.navigation.navigate(DashboardNavigator);
			}
		});
	}
	
	/**
	 * Log In the user with their Google Account
	 */
	signIn = () => {
		let params = {
			dashboardTitle: getStrings().Dashboard.name, 
			chatbotTitle: getStrings().Chatbot.name, 
			compareTitle: getStrings().CompareSchedule.name, 
			settingsTitle: getStrings().Settings.name
		};
		
		this.props.setBottomString(params);

		if (!this.state.clicked) {
			this.state.clicked = true;
			googleIsSignedIn().then((signedIn) => {
				if (!signedIn || !this.props.HomeReducer || this.props.HomeReducer.profile === null) {
					googleGetCurrentUserInfo().then((userInfo) => {
						if (userInfo !== undefined) {
							this.setUser(userInfo);
							this.setCalendar();
						}
						googleSignIn().then((userInfo) => {
							if (userInfo !== null) {
								this.setUser(userInfo);
								this.setCalendar();
							}
							this.state.clicked = false;
						});
					});
				} else {
					this.setCalendar();
				}
			});
		}
	}

	render() {
		let source = Platform.OS === 'ios' ? require('../../assets/img/loginScreen/backPattern_ios.png') : 
			require('../../assets/img/loginScreen/backPattern_android.png');
		return (
			<LinearGradient style={styles.container}
				colors={gradientColors}>
				<ImageBackground style={styles.container} 
					source={source}
					resizeMode="repeat">
					<StatusBar translucent={true} 
						barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
						backgroundColor={'#00000050'} />

					<View style={styles.content}>
						<View style={styles.topSection}>
							<Image style={styles.logo}
								source={require('../../assets/img/kalendLogo.png')}
								resizeMode="contain" />
						</View>
						
						<View style={styles.bottomSection}>
							<View style={styles.signInSection}>
								<GoogleSigninButton 
									style={styles.signInButton} 
									size={GoogleSigninButton.Size.Wide} 
									color={GoogleSigninButton.Color.Light} 
									onPress={this.signIn} />
							</View>

							<TouchableOpacity style={styles.cdhSection}
								onPress={ ()=>{
									Linking.openURL('https://cdhstudio.ca/fr');
								}}>
								<Text style={styles.cdhSectionText}>
									<Text style={styles.cdhText}>{this.strings.createdBy}</Text>

									<Text style={styles.cdhLink}>{this.strings.cdhStudio}</Text>
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

let mapStateToProps = (state) => {
	const { id } = state.CalendarReducer;
	const NavigationReducer = state.NavigationReducer;

	return {
		NavigationReducer,
		calendarID: id
	};
};

let mapDispatchToProps = (dispatch) => {
	return bindActionCreators({setCalendarID, logonUser, setBottomString, setCalendarColor }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);