import React from 'react';
import { connect } from 'react-redux';
import { ImageBackground, StatusBar, StyleSheet, Button, View, Image, Text } from 'react-native';
import {GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { googleSignIn, googleSignOut, googleRevokeAccess, googleIsSignedIn, googleGetCurrentUserInfo } from '../services/google_identity';


class Home extends React.Component {

	//In order to sign in with Google account
	signIn = () => {
		googleSignIn().then( (userInfo) => {
			this.setState({userInfo});
		});
	}

	render() {
		return (
			<ImageBackground  style={styles.container} source={require('../assets/img/bg-pattern.png')} resizeMode="repeat">
				<StatusBar translucent={true} backgroundColor={'#00000050'}/>
				
				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
				<Image style={{height: 80, width: undefined}} source={require('../assets/img/logo.png')} resizeMode="contain"/>
				
				<View style={{alignItems:'center'}}>
				<Text style={styles.text}>The Better Way to Start your Month!</Text>
				<Image source={require('../assets/img/userLogin.png')} />
					
				<GoogleSigninButton
					style={{width: 312, height: 48}}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Light}
					onPress={this.signIn} />
				</View>
				</View>
						
			</ImageBackground >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '110%',
		backgroundColor:'#1473E6',
		paddingTop: 80
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color:'#FFFFFF',
		fontSize: 20,
		paddingTop: 10,
		paddingBottom: 50
	}
});

export default Home;
