import React from 'react';
import {Platform, StatusBar, Text, View} from 'react-native';
import { blueColor } from '../../../config';

class EditSchoolSchedule extends React.Component {

	// Style for Navigation Bar
	static navigationOptions = {
		title: 'Edit Course',
		headerTintColor: 'white',
		headerTitleStyle: {fontFamily: 'Raleway-Regular'},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: blueColor,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	// Constructor and States
	constructor(props) {
		super(props);
		this.state = { 
			//Height of Screen
			containerHeight: null,

			//Title of Event
			courseCode: '',
			
			//Time section
			startDate: new Date().toDateString(),
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),

			startTime: new Date().toLocaleTimeString(),
			disabledStartTime : false,
			amPmStart: this.getAmPm(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime : true,
			amPmEnd: this.getAmPm(),

			//Other Information
			location: '',
			recurrenceValue: 'None',
			recurrence: 'NONE'
		};
	}

	render() {
		return(
			<View style={{width: '100%', height: '100%', paddingTop:100}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>Chatbot Screen</Text>

			</View>
		);
	}
}


export default EditSchoolSchedule;