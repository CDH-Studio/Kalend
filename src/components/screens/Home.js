import React from 'react';
import {connect} from 'react-redux';
import { ImageBackground, StatusBar, StyleSheet, View, Image, Text } from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import { googleSignIn, googleIsSignedIn, googleGetCurrentUserInfo } from '../../services/google_identity';
import LinearGradient from 'react-native-linear-gradient';
import { gradientColors } from '../../../config';
import updateNavigation from '../NavigationHelper';
import { store } from '../../store';

class Home extends React.Component {

	//Constructor and States
	constructor(props) {
		super(props);

		this.state = {
			clicked: false
		};
    
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	//Methods
	setUser = (userInfo) => {
		this.props.dispatch({
			type:'SIGNED_IN',
			user: userInfo
		});
	}
	
	signIn = () => {
		if (!this.state.clicked) {
			this.state.clicked = true;
			googleIsSignedIn().then((signedIn) => {
				console.log(signedIn);
				if (!signedIn || store.getState().HomeReducer.profile === null) {
					googleGetCurrentUserInfo().then((userInfo) =>{
						console.log(userInfo);
						if (userInfo !== undefined) {
							this.setUser(userInfo);
							console.log(store.getState());
							this.props.navigation.navigate('TutorialNavigator', {show: true});
						}
						googleSignIn().then((userInfo) => {
							console.log(userInfo);
							if (userInfo !== null) {
								this.setUser(userInfo);
								console.log(store.getState());
								this.props.navigation.navigate('TutorialNavigator', {show: true});
							}
							this.state.clicked = false;
						});
					});
				} else {
					console.log(store.getState());
					this.props.navigation.navigate('TutorialNavigator', {show: true});
				}
			});
		}
	}

	//Render UI
	render() {
		return (
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'#00000050'} />

					<View style={styles.content}>
						<View>
							<Image style={styles.logo} source={require('../../assets/img/kalendFullLogo.png')} resizeMode="contain" />
							<Text style={styles.text}>The Better Way to Start your Month!</Text>
						</View>

						<Image style={styles.userIcon} source={require('../../assets/img/loginScreen/userIcon.png')} resizeMode="contain" />

						<GoogleSigninButton 
							style={styles.signInButton} 
							size={GoogleSigninButton.Size.Wide} 
							color={GoogleSigninButton.Color.Light} 
							onPress={this.signIn} />
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

function mapStateToProps(state) {
	const main = state.NavigationReducer.main;
	const screen = state.NavigationReducer.screen;
	const profile = state.NavigationReducer.profile;
	return {
		main, 
		screen,
		profile
	};
}

export default connect(mapStateToProps, null)(Home);

//StyleSheet
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	content: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15
	},

	logo: {
		height: 100,
		width: undefined
	},

	text: {
		paddingTop: 10,
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		textAlign: 'center',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20
	},

	userIcon: {
		height: '35%'
	},

	signInButton: {
		width: 312,
		height: 48
	}
});