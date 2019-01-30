import React from 'react';
import {ImageBackground, StatusBar, StyleSheet, View, Image, Text} from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';
import {googleSignIn} from '../services/google_identity';
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
				<ImageBackground  style={styles.container} source={require('../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
			
					<StatusBar translucent={true} backgroundColor={'#00000050'}/>
				
					<View style={styles.content}>
						<View>
							<Image style={styles.logo} source={require('../assets/img/kalendFullLogo.png')} resizeMode="contain"/>
							<Text style={styles.text}>The Better Way to Start your Month!</Text>
						</View>
									
						<Image style={styles.userIcon} source={require('../assets/img/loginScreen/userIcon.png')} resizeMode="contain" />
					
						<GoogleSigninButton style={styles.signInButton} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Light} onPress={this.signIn} />
					</View>
					
				</ImageBackground >
			</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '110%' //Fixes pattern bug
	},

	content: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},

	logo: {
		height: 100, 
		width: undefined
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		paddingTop: 10,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20
	},

	userIcon: {
		height:'35%'
	},

	signInButton: {
		width: 312, 
		height: 48
	}
});

export default Home;