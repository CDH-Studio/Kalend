import React from 'react';
import {StatusBar, Text, View, Button} from 'react-native';

class ScheduleCreation extends React.Component {
	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>ScheduleCreation Screen</Text>
				
				<Button title={'To ScheduleSelection'} onPress={() => this.props.navigation.navigate('ScheduleSelection')} />
				
			</View>
		);
	}
}

export default ScheduleCreation;