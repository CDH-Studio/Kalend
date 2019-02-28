import React from 'react';
import {StatusBar, StyleSheet, View, Button, Text} from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import updateNavigation from '../NavigationHelper';
import { store } from '../../store';
import { SET_NAV_SCREEN, SET_IMG, SIGNED_IN, ADD_NFE, ADD_FE } from '../../constants';

class Dashboard extends React.Component {

	//Constructor and States
	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			opened: false,

			optionsOpen: false,
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	render() {
		const {optionsOpen} = this.state;
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>Redux Management</Text>

				<Button title='Clear NavigationRecuder' onPress={() => {
					store.dispatch({
						type: SET_NAV_SCREEN
					});
				}}></Button>

				<Button title='Clear ImageReducer' onPress={() => {
					store.dispatch({
						type: SET_IMG
					});
				}}></Button>

				<Button title='Clear ProfileReducer' onPress={() => {
					store.dispatch({
						type: SIGNED_IN
					});
				}}></Button>
				
				<Button title='Clear FixedReducer' onPress={() => {
					store.dispatch({
						type: ADD_FE
					});
				}}></Button>

				<Button title='Clear NonFixedReducer' onPress={() => {
					store.dispatch({
						type: ADD_NFE
					});
				}}></Button>

				<Button title='Go back home' onPress={() => {
					this.props.navigation.navigate('LoginNavigator');
				}}></Button>
				
				<Portal.Host>
					<FAB.Group
						open={optionsOpen}
						icon={optionsOpen ? 'close' : 'add'}
						actions={[
							{ icon: 'school', label: 'Add School Schedule', onPress: () => this.props.navigation.navigate('DashboardSchoolSchedule')},
							{ icon: 'today', label: 'Add Fixed Event', onPress: () => this.props.navigation.navigate('DashboardEditFixedEvent') },
							{ icon: 'face', label: 'Add Non-Fixed Event', onPress: () => this.props.navigation.navigate('DashboardEditNonFixedEvent') },
						]}
						onStateChange={() => this.setState({ optionsOpen: !optionsOpen })}
						style={styles.fab} /></Portal.Host>
			</View>
		);
	}
}

const styles = StyleSheet.create({

	fab: {
		position: 'absolute',
		right: 0,
	},
});

export default Dashboard;