import React from 'react';
import { ImageBackground, StatusBar, View, Image, Text, Linking, TouchableOpacity } from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { gradientColors } from '../../../config';
import updateNavigation from '../NavigationHelper';
import { googleSignIn, googleIsSignedIn, googleGetCurrentUserInfo } from '../../services/google_identity';
import { createCalendar, getCalendarID2 } from '../../services/service';
import { DashboardNavigator } from '../../constants/screenNames';
import { bindActionCreators } from 'redux';
import { setCalendarID, logonUser } from '../../actions';
import { homeStyles as styles } from '../../styles';


/** 
 * Home/Login screen of the app.
 * Permits the user to log into the app with their Google account.*/
class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clicked: false
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	/**
	 * Sets the user information
	 */
	setUser = (userInfo) => {
		this.props.logonUser(userInfo);	
	}


	setCalendar() {
		getCalendarID2().then(data => {
			if(data === undefined) {
				createCalendar().then(id => {
					this.props.setCalendarID(id);
				});
			} else {
				this.props.setCalendarID(data);
			}
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
							this.setCalendar();
							this.props.navigation.navigate(DashboardNavigator);
						}
						googleSignIn().then((userInfo) => {
							if (userInfo !== null) {
								this.setUser(userInfo);
								this.setCalendar();
								this.props.navigation.navigate(DashboardNavigator);
							}
							this.state.clicked = false;
						});
					});
				} else {
					this.setCalendar();
					this.props.navigation.navigate(DashboardNavigator);
				}
			});
		}
	}

	render() {
		return (
			<LinearGradient style={styles.container}
				colors={gradientColors}>
				<ImageBackground style={styles.container} 
					source={require('../../assets/img/loginScreen/backPattern.png')}
					resizeMode="repeat">
					<StatusBar translucent={true} 
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
	return bindActionCreators({setCalendarID, logonUser }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);