import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { compareScheduleStyles as styles } from '../../styles';
import updateNavigation from '../NavigationHelper';

class CompareSchedule extends React.Component {

	constructor(props) {
		super(props);

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#2d6986'} />
			</View>
		);
	}
}

export default CompareSchedule;