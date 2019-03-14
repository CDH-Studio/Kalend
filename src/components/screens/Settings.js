import React from 'react';
import { StatusBar, Button, View } from 'react-native';
import { persistor } from '../../store';
import { settingsStyles as styles, statusBlueColor } from '../../styles';
import { LoginNavigator, UnavailableRoute } from '../../constants/screenNames';

class Settings extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={statusBlueColor} />

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
						this.props.navigation.navigate(UnavailableRoute);
					}}>
				</Button>
				
			</View>
		);
	}
}

export default Settings;