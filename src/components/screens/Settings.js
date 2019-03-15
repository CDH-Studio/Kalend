import React from 'react';
import { StatusBar, View , TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { logoffUser } from '../../actions';
import { LoginNavigator, UnavailableRoute } from '../../constants/screenNames';
import { settingsStyles as styles } from '../../styles';

class Settings extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					backgroundColor={'#2d6986'} />

				<TouchableOpacity style={styles.button}
					onPress={() => {
						this.props.dispatch(logoffUser());
						this.props.navigation.navigate(LoginNavigator);
					}}>
					<Text style={styles.buttonText}>Log out</Text>
				</TouchableOpacity>


				<TouchableOpacity style={styles.button}
					onPress={() => {
						this.props.navigation.navigate(LoginNavigator);
					}}>
					<Text style={styles.buttonText}>Go Back Home</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button}
					onPress={() => {
						this.props.navigation.navigate(UnavailableRoute);
					}}>
					<Text style={styles.buttonText}>Set unavailable hours</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default connect()(Settings);