import React from 'react';
import { ImageBackground, StatusBar, View, Image, Text, Linking, TouchableOpacity, Platform } from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { setCalendarID, logonUser, setCalendarColor } from '../../actions';
import { gradientColors } from '../../../config/config';
import updateNavigation from '../NavigationHelper';
import { bindActionCreators } from 'redux';
import { googleSignIn, googleIsSignedIn, googleGetCurrentUserInfo } from '../../services/google_identity';
import { createCalendar, getCalendarID2 } from '../../services/service';
import { storeUserInfoService, updateUser } from '../../services/api/storage_services';
import { homeStyles as styles } from '../../styles';
import { DashboardNavigator } from '../../constants/screenNames';

/** 
 * Home/Login screen of the app.
 * Permits the user to log into the app with their Google account.*/
class Home extends React.PureComponent {

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
		this.setCalendar().then(id => {
			userInfo.calendarID = id;
			storeUserInfoService(userInfo)
				.then(res => res.json())
				.then((success) => {
					if (success) {
						this.props.logonUser(userInfo);
						this.props.navigation.navigate(DashboardNavigator);
					} else {
						alert('There was an error setting Users data');
					}
				})
				.catch((err) => {
					console.log('err', err);
				});
		});
	}

	/**
	 * Creates the Kalend calendar in the user's Google Account
	 */
	setCalendar() {
		return new Promise( async (resolve, reject) =>  {
			await getCalendarID2()
				.then( data => {
					if (data === undefined) {
						createCalendar()
							.then(id => {
								this.props.setCalendarID(id);
								this.props.setCalendarColor(data.calendarColor);
								resolve(id);
							});
					} else {
						this.props.setCalendarID(data);
						this.props.setCalendarColor(data.calendarColor);
						resolve(data);
					}
				}).catch(err => {
					reject(err);
					alert(err);
				});
		});
	}	

	
	/**
	 * Log In the user with their Google Account
	 */
	signIn = () => {
		if (!this.state.clicked) {
			this.state.clicked = true;
			googleIsSignedIn().then((signedIn) => {
				if (!signedIn || !this.props.HomeReducer || this.props.HomeReducer.profile === null) {
					googleGetCurrentUserInfo().then((userInfo) => {
						if (userInfo !== undefined) {
							this.setUser(userInfo);
						}
						googleSignIn().then((userInfo) => {
							if (userInfo !== null) {
								this.setUser(userInfo);
							}
							this.state.clicked = false;
						});
					});
				} else {
					this.setCalendar().then(id => {
						updateUser({values:[id], columns:['CALENDARID']});	
					});
					this.props.navigation.navigate(DashboardNavigator);
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
									Linking.openURL('https://cdhstudio.ca/');
								}}>
								<Text style={styles.cdhSectionText}>
									<Text style={styles.cdhText}>Created by </Text>

									<Text style={styles.cdhLink}>CDH Studio</Text>
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
	return bindActionCreators({setCalendarID, logonUser, setCalendarColor}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);