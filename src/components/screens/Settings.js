import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { blueColor } from '../../../config';
import { settingsStyles as styles } from '../../styles';

class Settings extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={blueColor} />

				<Text>Settings Screen</Text>
				
			</View>
		);
	}
}

export default Settings;