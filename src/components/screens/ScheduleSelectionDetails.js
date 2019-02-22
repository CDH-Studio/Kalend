import React from 'react';
import {Text, Platform, StatusBar, View} from 'react-native';
import { blueColor } from '../../../config';

class ScheduleSelectionDetails extends React.Component {
	static navigationOptions = {
		title: 'First Schedule',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerStyle: {
			backgroundColor: blueColor,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};
	
	render() {
		return(
			<View>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />
				<Text>ScheduleSelectionDetails Screen</Text>
			</View>
		);
	}
}

export default ScheduleSelectionDetails;