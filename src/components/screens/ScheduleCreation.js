import React from 'react';
import { StatusBar, BackHandler, Alert, Text, View, Platform } from 'react-native';
import * as Progress from 'react-native-progress';
import { Surface } from 'react-native-paper';
import { InsertCourseEventToCalendar, InsertFixedEventToCalendar, generateCalendars, setUserInfo } from '../../services/service';
import { connect } from 'react-redux';
import { DashboardNavigator, ScheduleSelectionRoute } from '../../constants/screenNames';
import { scheduleCreateStyles as styles, dark_blue, statusBlueColor } from '../../styles';
import updateNavigation from '../NavigationHelper';

/**
 * The loading screen shown after the user reviewed their events
 */
class ScheduleCreation extends React.PureComponent {

	// Removes the header
	static navigationOptions = {
		header: null,
		headerLeft: null,
		gesturesEnabled: false,
	};

	constructor(props) {
		super(props);

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		// Adds a little delay before going to the next screen
		setUserInfo();
		this.InsertFixedEventsToGoogle().then(() => {
			if (this.props.NonFixedEventsReducer.length != 0) {
				setTimeout(() =>{ 
					this.generateScheduleService();
				}, 3000);
				
			} else  {
				this.navigateToSelection();
			}
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}
	
	handleBackButton = () => {
		Alert.alert(
			'',
			'Are you sure you want to stop the schedule creating process?',
			[
				{
					text: 'No',
					style: 'cancel',
				},
				{text: 'Yes', 
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
					},
				},
			],
			{cancelable: true},
		);
		return true;
	}

	generateScheduleService = () => {
		generateCalendars().then(() => {
			this.navigateToSelection();
		});
	}

	InsertFixedEventsToGoogle = () => {
		return new Promise((resolve) => {
			this.props.CoursesReducer.forEach(async (event) => {
				await InsertCourseEventToCalendar(event).then(data => {
					if (data.error) {
						console.error('ERROR adding event', data);
					}
				});
			});
			console.log('Finished Inserting Courses');
			this.props.FixedEventsReducer.map(async (event) => {
				let info = {
					title: event.title,
					location: event.location,
					description: event.description,
					recurrence: event.recurrence,
					allDay: event.allDay,
					startDate: event.startDate,
					startTime: event.startTime,
					endDate: event.endDate,
					endTime: event.endTime
				}; 
				await InsertFixedEventToCalendar(info).then(data => {
					if (data.error) {
						console.error('ERROR adding event', data);
					}
				});
			});
			console.log('Finished Inserting Fixed');
			resolve();
		});
	}

	/**
	 * Goes to the next screen
	 */
	navigateToSelection = () => {
		this.props.navigation.navigate(ScheduleSelectionRoute);
	}
	
	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<Surface style={styles.surface}>
					<Text style={styles.title}>Creating your Schedule</Text>

					<Text style={styles.subtitle}>Our AI is now perfecting multiple schedule for you</Text>

					<Progress.Bar style={styles.progressBar} 
						indeterminate={true} 
						width={200} 
						color={dark_blue} 
						useNativeDriver={true} 
						borderColor={dark_blue} 
						unfilledColor={'#79A7D2'}/>
				</Surface>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const {FixedEventsReducer, CoursesReducer, NonFixedEventsReducer, GeneratedNonFixedEventsReducer} = state;
	
	return {
		FixedEventsReducer,
		CoursesReducer,
		NonFixedEventsReducer,
		GeneratedNonFixedEventsReducer
	};
};

export default connect(mapStateToProps, null)(ScheduleCreation);