import React from 'react';
import { StatusBar, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
import { cleanReducersStyles as styles, blue, dark_blue } from '../../styles';
import { clearCalendarID, clearCourse, clearFixedEvents, clearNonFixedEvents, clearGeneratedNonFixedEvents, clearNavigation, clearSchoolInformation, clearState, clearUnavailableHours, logoffUser } from '../../actions';
import { LoginNavigator } from '../../constants/screenNames';
import { connect } from 'react-redux';
import updateNavigation from '../NavigationHelper';

class CleanReducers extends React.PureComponent {
	static navigationOptions = {
		title: 'Clean Reducers',
		headerStyle: {
			backgroundColor: blue,
		}
	};

	reducersDeleteActions = {
		'Course': clearCourse,
		'Calendar ID': clearCalendarID,
		'Fixed Events': clearFixedEvents,
		'Non-Fixed Events': clearNonFixedEvents,
		'Generated Non-Fixed Events': clearGeneratedNonFixedEvents,
		'Navigation': clearNavigation,
		'Schedule': clearNavigation,
		'School Information': clearSchoolInformation,
		'State of Application': clearState,
		'Unavailable Hours': clearUnavailableHours,
		'User Profile': logoffUser
	};

	constructor(props) {
		super(props);

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}
	
	render() {
		return(
			<ScrollView style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#2d6986'} />

				{
					Object.keys(this.reducersDeleteActions).map((data, key) => {
						return (
							<TouchableOpacity onPress={() => this.props.dispatch(this.reducersDeleteActions[data]())}
								key={key}
								style={styles.button}>
								<Text style={styles.buttonText}>{data}</Text>
							</TouchableOpacity>
						);
					})
				}

				<TouchableOpacity style={[styles.button, {backgroundColor: dark_blue}]}
					onPress={() => {
						this.props.navigation.navigate(LoginNavigator);
					}}>
					<Text style={styles.buttonText}>Go Back Home</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	}
}

export default connect()(CleanReducers);