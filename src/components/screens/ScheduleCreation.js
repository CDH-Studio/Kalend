import React from 'react';
import {StatusBar, Text, View, Button} from 'react-native';
import updateNavigation from '../NavigationHelper';

class ScheduleCreation extends React.Component {
	
	constructor(props) {
		super(props);
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}
	
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