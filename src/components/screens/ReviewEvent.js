import React from 'react';
import { StatusBar, ScrollView, View, Text, TouchableOpacity, Platform,Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { deleteCourse, deleteFixedEvent, deleteNonFixedEvent, clearGeneratedCalendars, clearGeneratedNonFixedEvents } from '../../actions';
import { SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, ScheduleCreationRoute, SchoolInformationRoute, CourseRoute } from '../../constants/screenNames';
import EventOverview from '../EventOverview';
import updateNavigation from '../NavigationHelper';
import { store } from '../../store';
import { reviewEventStyles as styles, white, blue, statusBlueColor } from '../../styles';

const priorityLevels = {
	0: 'Low',
	0.5: 'Normal',
	1: 'High'
};

/**
 * Permits users to verify and edit the events they added
 */
class ReviewEvent extends React.PureComponent {

	static navigationOptions = {
		title: 'Create a Schedule',
		headerStyle: {
			backgroundColor: white,
		}
	};

	constructor(props) {
		super(props);

		this.state = {
			showFAB: true,
			currentY: 0,
			fixedEventData: [],
			nonFixedEventData: [],
			schoolScheduleData: [],
			showTutShadow: true
		};

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		this.updateInformation();
	}

	componentWillReceiveProps() {
		this.updateInformation();
		this.forceUpdate();
	}

	updateInformation = () => {
		let fixedEventData = [];
		let nonFixedEventData = [];
		let schoolScheduleData = [];

		if (store.getState().CoursesReducer !== undefined) {
			store.getState().CoursesReducer.map((data) => {
				let hours;

				if (data.startTime === undefined) {
					hours = `${data.hours[0][0]}:${data.hours[0][1]} ${data.hours[0][2]} - ${data.hours[1][0]}:${data.hours[1][1]} ${data.hours[1][2]}`;
				} else {
					hours = data.startTime + ' - ' + data.endTime;
				}

				schoolScheduleData.push({
					courseCode: data.summary || data.courseCode,
					dayOfWeek: data.day || data.dayOfWeek,
					hours,
					location: data.location
				});
			});
		}

		if (store.getState().FixedEventsReducer !== undefined) {
			store.getState().FixedEventsReducer.map((data) => {
				fixedEventData.push({
					title: data.title,
					dates: data.startDate + ' - ' + data.endDate,
					recurrence: data.recurrenceValue,
					hours: data.allDay ? 'All-Day' : (data.startTime + ' - ' + data.endTime),
					location: data.location,
					description: data.description
				});
			});
		}

		if (store.getState().NonFixedEventsReducer !== undefined) {
			store.getState().NonFixedEventsReducer.map((data) => {
				nonFixedEventData.push({
					title: data.title,
					location: data.location,
					priorityLevel: priorityLevels[data.priority],
					dates: data.specificDateRange ? (`${data.startDate} - ${data.endDate}`): 'Week',
					description: data.description,
					occurence: `${data.occurrence} times/week`,
					duration: `${data.hours}h ${data.minutes}m`
				});
			});
		}

		this.setState({
			fixedEventData,
			nonFixedEventData,
			schoolScheduleData
		});
	}
	
	deleteEvent = (id, category) => {
		let dataToDispatch;
		let newEvents;
		let objectToChange;

		switch (category) {
			case SchoolScheduleRoute:
				dataToDispatch = deleteCourse(id);
				newEvents = this.state.schoolScheduleData;
				objectToChange = 'schoolScheduleData';
				break;
			case FixedEventRoute:
				dataToDispatch = deleteFixedEvent(id);
				newEvents = this.state.fixedEventData;
				objectToChange = 'fixedEventData';
				break;
			case NonFixedEventRoute:
				dataToDispatch = deleteNonFixedEvent(id);
				newEvents = this.state.nonFixedEventData;
				objectToChange = 'nonFixedEventData';
				break;
				
			default:
				break;
		}

		newEvents = newEvents.filter((event,index) => {
			if (index != id) return event;
		});

		this.props.dispatch(dataToDispatch);
		this.setState({[objectToChange]: newEvents});
	}

	/**
	 * Goes to the appropriate Edit Screen
	 */
	navigateEditScreen = (editScreen) => {
		this.props.navigation.navigate('Edit' + editScreen);
	}

	/**
	 * Goes to the appropriate Schedule Creation Screen
	 */
	navigateCreationScreen = () => {
		this.props.dispatch(clearGeneratedCalendars());
		this.props.dispatch(clearGeneratedNonFixedEvents());

		if (this.state.schoolScheduleData.length == 0 && this.state.nonFixedEventData.length == 0 && this.state.fixedEventData.length == 0 ) {
			Alert.alert(
				'Error',
				'You need to create events in order to generate a Calendar',
				[
					{text: 'OK'},
				],
				{cancelable: false}
			);
			return;
		}
		this.props.navigation.navigate(ScheduleCreationRoute);
	}

	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<ScrollView style={styles.scrollView}>
					<View style={styles.content}>
						<View>
							<View style={{justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'flex-end'}}>
								<Text style={styles.sectionTitle}>School Schedule</Text>
								<TouchableOpacity onPress={() => {
									if (this.props.hasSchoolInformation) {
										if (this.props.checked) {
											this.props.navigation.navigate(CourseRoute);
										} else {
											this.props.navigation.navigate(SchoolScheduleRoute);
										}
									} else {
										this.props.navigation.navigate(SchoolInformationRoute, {reviewEvent: true});
									}
								}}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.schoolScheduleData.length === 0 ?
									<Text style={styles.textNoData}>No School Schedule or Courses added</Text> : 
									this.state.schoolScheduleData.map((i,key) => {
										return <EventOverview key={key}
											id={key}
											category={'SchoolSchedule'}
											eventTitle={i.courseCode}
											date={i.dayOfWeek}
											time={i.hours}
											location={i.location}
											navigateEditScreen={this.navigateEditScreen}
											action={this.deleteEvent} />;
									})
							}
						</View>

						<View>
							<View style={{justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'flex-end'}}>
								<Text style={styles.sectionTitle}>Fixed Events</Text>
								<TouchableOpacity onPress={() => this.props.navigation.navigate(FixedEventRoute)}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.fixedEventData.length === 0 ?
									<Text style={styles.textNoData}>No Fixed events added</Text> : 
									this.state.fixedEventData.map((i,key) => {
										return <EventOverview key={key}
											id={key}
											category={'FixedEvent'}
											eventTitle={i.title}
											date={i.dates}
											time={i.hours}
											location={i.location}
											description={i.description}
											recurrence={i.recurrence}
											navigateEditScreen={this.navigateEditScreen}
											action={this.deleteEvent} />;
									})
							}
						</View>

						<View>
							<View style={{justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'flex-end'}}>
								<Text style={styles.sectionTitle}>Non-Fixed Events</Text>
								<TouchableOpacity onPress={() => this.props.navigation.navigate(NonFixedEventRoute)}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.nonFixedEventData.length === 0 ?
									<Text style={styles.textNoData}>No Non-Fixed events added</Text> : 
									this.state.nonFixedEventData.map((i,key) => {
										return <EventOverview key={key}
											id={key} 
											category={'NonFixedEvent'} 
											eventTitle={i.title} 
											date={i.dates} 
											time={i.duration} 
											recurrence={i.occurence} 
											priorityLevel={i.priorityLevel} 
											location={i.location} 
											description={i.description} 
											navigateEditScreen={this.navigateEditScreen}
											action={this.deleteEvent}
										/>;
									})
							}
						</View>
					</View>		
				</ScrollView>

				<FAB style={styles.fab}
					icon="check"
					theme={{colors:{accent:blue}}}
					visible={this.state.showFAB}
					onPress={this.navigateCreationScreen} />
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { FixedEventsReducer, NonFixedEventsReducer, CoursesReducer, NavigationReducer, SchoolInformationReducer } = state;

	return {
		FixedEventsReducer,
		NonFixedEventsReducer,
		CoursesReducer, 
		selectedIndex: NavigationReducer.reviewEventSelected,
		hasSchoolInformation: SchoolInformationReducer.info,
		checked: SchoolInformationReducer.info && SchoolInformationReducer.info.info.checked === 'third'
	};
} 

export default connect(mapStateToProps, null)(ReviewEvent);