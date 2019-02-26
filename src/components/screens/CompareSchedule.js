import React from 'react';
import {StatusBar, Text, View} from 'react-native';

class CompareSchedule extends React.Component {
	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>CompareSchedule Screen</Text>
				
			</View>
		);
	}
}

export default CompareSchedule;