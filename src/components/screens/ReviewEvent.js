import React from 'react';
import { Platform, StatusBar, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { FAB } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { InsertFixedEvent } from '../../services/service';
import EventOverview from '../EventOverview';
import updateNavigation from '../NavigationHelper';
import { store } from '../../store';
import { reviewEventStyles as styles, white, blue, statusBlueColor } from '../../styles';
import TutorialStatus, { HEIGHT, onScroll } from '../TutorialStatus';
import { deleteCourse, deleteFixedEvent, deleteNonFixedEvent } from '../../actions';

const priorityLevels = {
	0: 'Low',
	0.5: 'Normal',
	1: 'High'
};
const tutorialHeight = HEIGHT;
const containerHeight = containerHeight;

/**
 * Permits users to verify and edit the events they added
 */
class ReviewEvent extends React.Component {

	static navigationOptions = {
		title: 'Review Events',
		headerTintColor: white,
		headerTitleStyle: {fontFamily: 'Raleway-Regular'},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: blue,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	constructor(props) {
		super(props);
		updateNavigation(this.constructor.name, props.navigation.state.routeName);

		this.state = {
			containerHeight: null,
			showFAB: true,
			currentY: 0,
			fixedEventData: [],
			nonFixedEventData: [],
			schoolScheduleData: [],
			showTutShadow: true
		};
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
					hours = this.formatTime(data.startTime) + ' - ' + this.formatTime(data.endTime);
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
					hours: data.allDay ? 'All-Day' : (this.formatTime(data.startTime) + ' - ' + this.formatTime(data.endTime)),
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
					dates: data.specificDateRange ? (`${data.startDate} - ${data.endDate}`): 'No specific date range',
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

	formatTime = (time) => {
		if (time.split(':').length === 3) {
			let timeSplit = time.split(':');
			let timeSplitSpace = time.split(' ');

			time = timeSplit[0] + ':' + timeSplit[1] + ' ' + timeSplitSpace[1];
		}

		return time;
	}
	
	/**
	 * Hides the FAB when scrolling down */ 
	onScroll = (event) => {
		event = Math.abs(event.nativeEvent.contentOffset.y);
		if (event > Math.abs(this.state.currentY)) {
			this.setState({
				showFAB: false,
				currentY: event
			});
		} else {
			this.setState({
				showFAB: true,
				currentY: event
			});
		}
	}
	
	deleteEvent = (id, category) => {
		let dataToDispatch;
		let newEvents;
		let objectToChange;

		switch (category) {
			case 'SchoolSchedule':
				dataToDispatch = deleteCourse(id);
				newEvents = this.state.schoolScheduleData;
				objectToChange = 'schoolScheduleData';
				break;
			case 'FixedEvent':
				dataToDispatch = deleteFixedEvent(id);
				newEvents = this.state.fixedEventData;
				objectToChange = 'fixedEventData';
				break;
			case 'NonFixedEvent':
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
		store.getState().FixedEventsReducer.map((event) => {
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
			InsertFixedEvent(info).then(data => {
				if (data.error) {
					console.error('ERROR adding event', data);
				}
			});
		});

		this.props.navigation.navigate('ScheduleCreation');
	}

	render() {
		const { showTutShadow } = this.state;
		const containerHeight = Dimensions.get('window').height - Header.HEIGHT;

		/**
		 * In order to remove the tutorial status if not needed */
		let tutorialStatus;

		if (this.props.navigation.state.routeName === 'ReviewEvent') {
			tutorialStatus = <TutorialStatus active={4}
				color={blue}
				backgroundColor={white}
				showTutShadow={showTutShadow} />;
		} else {
			tutorialStatus = null;
		}

		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor} />

				<ScrollView style={styles.scrollView}
					onScroll={(event) => { 
						this.setState({showTutShadow: onScroll(event, showTutShadow)});
						this.onScroll(event);
					}}
					scrollEventThrottle={100} >
					<View style={[styles.content, {height: containerHeight, paddingBottom: tutorialHeight + 16}]} 
						onLayout={(event) => {
							let {height} = event.nativeEvent.layout;
							if (height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View>
							<View style={{justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'flex-end'}}>
								<Text style={styles.sectionTitle}>School Schedule</Text>
								<TouchableOpacity onPress={() => this.props.navigation.navigate('AddCourse')}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.schoolScheduleData.length === 0 ?
									<Text style={styles.textNoData}>No school schedule added, please go back to add one</Text> : 
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
								<TouchableOpacity onPress={() => this.props.navigation.navigate('FixedEvent')}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.fixedEventData.length === 0 ?
									<Text style={styles.textNoData}>No fixed events added, please go back to add some</Text> : 
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
								<TouchableOpacity onPress={() => this.props.navigation.navigate('NonFixedEvent')}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.nonFixedEventData.length === 0 ?
									<Text style={styles.textNoData}>No non-fixed events added, please go back to add some</Text> : 
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

				{tutorialStatus}
				
				<FAB style={styles.fab}
					icon="check"
					visible={this.state.showFAB}
					onPress={this.navigateCreationScreen} />
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { FixedEventsReducer, NonFixedEventsReducer, CoursesReducer, NavigationReducer } = state;

	return {
		FixedEventsReducer,
		NonFixedEventsReducer,
		CoursesReducer, 
		selectedIndex: NavigationReducer.reviewEventSelected
	};
}

export default connect(mapStateToProps, null)(ReviewEvent);