import React from 'react';
import {StatusBar, Text, View} from 'react-native';

class Settings extends React.Component {
	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>Settings Screen</Text>
				
			</View>
		);
	}
}

export default Settings;