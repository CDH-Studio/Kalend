import React from 'react';
import {StatusBar, Text, StyleSheet, View} from 'react-native';
import { FAB } from 'react-native-paper';
import updateNavigation from '../NavigationHelper';

class ReviewEvent extends React.Component {
	
	constructor(props) {
		super(props);
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}
	
	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>ReviewEvent Screen</Text>

				<FAB
					style={styles.fab}
					icon="check"
					onPress={() => this.props.navigation.navigate('ScheduleCreation')} />
			</View>
		);
	}
}

const styles = StyleSheet.create({

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default ReviewEvent;