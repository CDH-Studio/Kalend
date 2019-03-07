import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { settingsStyles as styles, blue } from '../../styles';

class Settings extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={blue} />

				<Text>Settings Screen</Text>
				
			</View>
		);
	}
}

export default Settings;