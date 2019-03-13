import React from 'react';
import { StatusBar, Button, View } from 'react-native';
import { persistor } from '../../store';
import { settingsStyles as styles, blue } from '../../styles';
import { LoginNavigator } from '../../constants/screenNames';

class Settings extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={blue} />

				<Button title='Purge' 
					onPress={() => {
						persistor.purge();
					}}>
				</Button>
				<Button title='Go back home'
					onPress={() => {
						this.props.navigation.navigate(LoginNavigator);
					}}>
				</Button>


				<Button title='Set unavailable hours'
					onPress={() => {
						this.props.navigation.navigate('UnavailableHours');
					}}>
				</Button>
				
			</View>
		);
	}
}

export default Settings;