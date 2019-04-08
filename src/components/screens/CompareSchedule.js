import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { compareScheduleStyles as styles } from '../../styles';
import updateNavigation from '../NavigationHelper';

class CompareSchedule extends React.PureComponent {

	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);

		updateNavigation('CompareSchedule', props.navigation.state.routeName);
	}

	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={'#00000050'} />
			</View>
		);
	}
}

export default CompareSchedule;