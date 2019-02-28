import React from 'react';
import {StatusBar, Text, View, Button} from 'react-native';
import updateNavigation from '../NavigationHelper';

class ScheduleCreation extends React.Component {
	
	constructor(props) {
		super(props);
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	navigateToSelection = () => {
		if(this.props.navigation.state.routeName === 'TutorialScheduleCreation') {
			this.props.navigation.navigate('TutorialScheduleSelection');
		}else {
			this.props.navigation.navigate('DashboardScheduleSelection');
		}
	}
	
	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>ScheduleCreation Screen</Text>
				
				<Button title={'To ScheduleSelection'} onPress={this.navigateToSelection} />
				
			</View>
		);
	}
}

export default ScheduleCreation;