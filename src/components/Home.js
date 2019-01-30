import React from 'react';
/*import { connect } from 'react-redux';*/
import { ImageBackground, StatusBar, StyleSheet, Button } from 'react-native';
import { GoogleSigninButton } from 'react-native-google-signin';
import { googleSignIn, googleSignOut, googleRevokeAccess, googleIsSignedIn, googleGetCurrentUserInfo } from '../services/google_identity';

class Home extends React.Component {

	signIn = () => {
		googleSignIn().then( (userInfo) => {
			this.setState({userInfo});
		});
	}

	render() {
		return (
			<ImageBackground  style={styles.container} source={require('../assets/img/bg-pattern.png')} resizeMode="repeat">
				<StatusBar translucent={true} backgroundColor={'#00000050'}/>
			
				<GoogleSigninButton
					style={{ width: 312, height: 48 }}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Light}
					onPress={this.signIn} />

				<Button 
					title="Print State"
					onPress={this.test} />

				<Button 
					title="Sign Out"
					onPress={googleSignOut} />

				<Button 
					title="Revoke Access"
					onPress={googleRevokeAccess} />

				<Button 
					title="Is Signed In"
					onPress={() => googleIsSignedIn().then((result) => console.log(result))} />

				<Button 
					title="Get Current User Info"
					onPress={() => googleGetCurrentUserInfo().then((result) => console.log(result))} />
			</ImageBackground >
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '110%',
		backgroundColor:'#1473E6',
		justifyContent: 'center',
		alignItems: 'center',
	}
});

export default Home;
