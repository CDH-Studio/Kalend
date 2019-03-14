import React from 'react';
import { StatusBar,BackHandler, Alert,  Text, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { Surface } from 'react-native-paper';
import { generateNonFixedEvents, InsertCourseEventToCalendar, InsertFixedEventToCalendar } from '../../services/service';
import { gradientColors } from '../../../config';
import { connect } from 'react-redux';
import { DashboardNavigator, ScheduleSelectionRoute } from '../../constants/screenNames';
import { scheduleCreateStyles as styles, dark_blue } from '../../styles';

/**
 * The loading screen shown after the user reviewed their events
 */
class ScheduleCreation extends React.Component {

	// Removes the header
	static navigationOptions = {
		header: null,
		headerLeft: null,
		gesturesEnabled: false,
	};

	componentWillMount() {
		// Adds a little delay before going to the next screen
		//this.generateScheduleService();
		this.InsertFixedEventsToGoogle().then(() => {
			if (this.props.NonFixedEventsReducer.length != 0) this.generateScheduleService();
			else this.navigateToSelection();
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}


	handleBackButton = () => {
		Alert.alert(
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
			{cancelable: false},
		);
		return true;
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}
	
	generateScheduleService = () => {
		generateNonFixedEvents().then(() => {
			console.log('Finished creating Non Fixed');
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
			<LinearGradient style={styles.container} 
				colors={gradientColors}>
				<ImageBackground style={styles.container} 
					source={require('../../assets/img/loginScreen/backPattern.png')} 
					resizeMode="repeat">
					<StatusBar translucent={true} 
						backgroundColor={'rgba(0, 0, 0, 0.2)'} />

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
				</ImageBackground>
			</LinearGradient>
		);
	}
}

let mapStateToProps = (state) => {
	const {FixedEventsReducer, CoursesReducer, NonFixedEventsReducer} = state;
	
	return {
		FixedEventsReducer,
		CoursesReducer,
		NonFixedEventsReducer
	};
};

export default connect(mapStateToProps, null)(ScheduleCreation);