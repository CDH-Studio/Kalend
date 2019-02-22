import React from 'react';
import {Text, Platform, StatusBar} from 'react-native';
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
			<Text>ScheduleSelectionDetails Screen</Text>
		);
	}
}

export default ScheduleSelectionDetails;