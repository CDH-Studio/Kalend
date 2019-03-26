import React from 'react';
import { StatusBar, BackHandler, Alert, Text, View, Platform } from 'react-native';
import * as Progress from 'react-native-progress';
import { Surface } from 'react-native-paper';
import { HeaderBackButton } from 'react-navigation';
import { InsertCourseEventToCalendar, InsertFixedEventToCalendar, generateCalendars, setUserInfo } from '../../services/service';
import { connect } from 'react-redux';
import { DashboardNavigator, ScheduleSelectionRoute, ReviewEventRoute } from '../../constants/screenNames';
import { scheduleCreateStyles as styles, dark_blue, white } from '../../styles';
import updateNavigation from '../NavigationHelper';

/**
 * The loading screen shown after the user reviewed their events
 */
class ScheduleCreation extends React.PureComponent {

	// Removes the header
	static navigationOptions = ({ navigation }) => ({
		gesturesEnabled: false,
		headerLeft: <HeaderBackButton title='Back' tintColor={white} onPress={() => {
			navigation.getParam('onBackPress')(); 
		}} />,
	});

	constructor(props) {
		super(props);

		this.state = {
			alertDialog: false,
			goToNextScreen: false
		};

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		// Adds a little delay before going to the next screen
		setUserInfo();
		this.InsertFixedEventsToGoogle()
			.then(() => {
				if (this.props.NonFixedEventsReducer.length != 0) {
					setTimeout(() =>{ 
						this.generateScheduleService();
					}, 3000);
				} else  {
					this.setState({goToNextScreen: true});
					this.navigateToSelection();
				}
			})
			.catch(err => {
				if (err) {
					Alert.alert(
						'Error',
						err,
						[
							{text: 'OK', onPress: () => this.props.navigation.navigate(DashboardNavigator)},
						],
						{cancelable: false}
					);
				}
			});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.props.navigation.setParams({onBackPress:  this.handleBackButton});
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}
	
	handleBackButton = () => {
		this.setState({alertDialog: true});
		Alert.alert(
			'Stopping creation',
			'The schedules will stop being generated if you proceed, where do you want to go?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
					onPress: () => {
						this.setState({alertDialog: false});
						this.navigateToSelection();
					}
				},
				{
					text: 'Dashboard',
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
					}
				},
				{
					text: 'Review Events', 
					onPress: () => {
						this.props.navigation.navigate(ReviewEventRoute);
					},
				},
			],
			{cancelable: false},
		);
		return true;
	}

	generateScheduleService = () => {
		generateCalendars().then(() => {
			this.setState({goToNextScreen: true});
			this.navigateToSelection();
		});
	}

	InsertFixedEventsToGoogle = () => {
		return new Promise((resolve, reject) => {
			this.props.CoursesReducer.forEach(async (event) => {
				await InsertCourseEventToCalendar(event).then(data => {
					if (data.error) {
						reject(data.error);
					}
				});
			});

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
						reject(data.error);
					}
				});
			});
			resolve();
		});
	}

	/**
	 * Goes to the next screen
	 */
	navigateToSelection = () => {
		if (this.state.goToNextScreen && !this.state.alertDialog) {
			this.props.navigation.navigate(ScheduleSelectionRoute);
		}
	}
	
	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'rgba(0,0,0,0.5)'} />

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