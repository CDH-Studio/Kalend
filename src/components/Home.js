import React from 'react';
import { connect } from 'react-redux';
import { ImageBackground, StatusBar, StyleSheet, Button, View, Image, Text } from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';
import { googleSignIn, googleSignOut, googleRevokeAccess, googleIsSignedIn, googleGetCurrentUserInfo } from '../services/google_identity';
import LinearGradient from 'react-native-linear-gradient';


class Home extends React.Component {

	//In order to sign in with Google account
	signIn = () => {
		googleSignIn().then( (userInfo) => {
			this.setState({userInfo});
		});
	}

	render() {
		return (
			<LinearGradient style={styles.container} colors={['#1473E6', '#0E55AA']}>
				<ImageBackground  style={styles.container} source={require('../assets/img/pattern.png')} resizeMode="repeat">
			
					<StatusBar translucent={true} backgroundColor={'#00000050'}/>
				
					<View style={{alignItems:'center', flex:1, flexDirection: 'column', justifyContent: 'space-evenly'}}>
						<View>
							<Image style={{height: 80, width: undefined}} source={require('../assets/img/logo.png')} resizeMode="contain"/>
							<Text style={styles.text}>The Better Way to Start your Month!</Text>
						</View>						
						<Image source={require('../assets/img/userLogin.png')} />

						<GoogleSigninButton
							style={{width: 312, height: 48}}
							size={GoogleSigninButton.Size.Wide}
							color={GoogleSigninButton.Color.Light}
							onPress={this.signIn} />
					</View>
					
				</ImageBackground >
			</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color:'#FFFFFF',
		fontSize: 20,
		paddingTop: 10
	}
});

export default Home;
