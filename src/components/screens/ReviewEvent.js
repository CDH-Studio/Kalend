import React from 'react';
import { Platform, StatusBar, ScrollView, View, Text, Dimensions } from 'react-native';
import { FAB } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { statusBlueColor } from '../../../config';
import { DELETE_NFE, DELETE_FE, DELETE_COURSE } from '../../constants';
import EventOverview from '../EventOverview';
import updateNavigation from '../NavigationHelper';
import { store } from '../../store';
import { reviewEventStyles as styles, white, blue } from '../../styles';
import TutorialStatus, { HEIGHT } from '../TutorialStatus';
import { TutorialReviewEvent, TutorialScheduleCreation, DashboardScheduleCreation } from '../../constants/screenNames';

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
			schoolScheduleData: []
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

		console.log(store.getState());

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
		let newEvents;
		let eventType;
		let objectToChange;

		switch (category) {
			case 'SchoolSchedule':
				eventType = DELETE_COURSE;
				newEvents = this.state.schoolScheduleData;
				objectToChange = 'schoolScheduleData';
				break;
			case 'FixedEvent':
				eventType = DELETE_FE;
				newEvents = this.state.fixedEventData;
				objectToChange = 'fixedEventData';
				break;
			case 'NonFixedEvent':
				eventType = DELETE_NFE;
				newEvents = this.state.nonFixedEventData;
				objectToChange = 'nonFixedEventData';
				break;
				
			default:
				break;
		}

		newEvents = newEvents.filter((event,index) => {
			if (index != id) return event;
		});

		this.props.dispatch({type: eventType, event: newEvents});
		this.setState({[objectToChange]: newEvents});
	}

	/**
	 * Goes to the appropriate Edit Screen
	 */
	navigateEditScreen = (editScreen) => {
		if (this.props.navigation.state.routeName === TutorialReviewEvent) {
			this.props.navigation.navigate('TutorialEdit' + editScreen, {update:true});
		} else {
			this.props.navigation.navigate('DashboardEdit' + editScreen, {update:true});
		}
	}

	/**
	 * Goes to the appropriate Schedule Creation Screen
	 */
	navigateCreationScreen = () => {
		if (this.props.navigation.state.routeName === TutorialReviewEvent) {
			this.props.navigation.navigate(TutorialScheduleCreation);
		} else {
			this.props.navigation.navigate(DashboardScheduleCreation);
		}
	}

	render() {
		const containerHeight = Dimensions.get('window').height - Header.HEIGHT;

		/**
		 * In order to remove the tutorial status if not needed */
		let tutorialStatus;

		if (this.props.navigation.state.routeName === TutorialReviewEvent) {
			tutorialStatus = <TutorialStatus active={4}
				color={blue}
				backgroundColor={white} />;
		} else {
			tutorialStatus = null;
		}

		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor} />

				<ScrollView style={styles.scrollView}
					onScroll={this.onScroll}>
					<View style={[styles.content, {height: containerHeight, paddingBottom: tutorialHeight + 16}]} 
						onLayout={(event) => {
							let {height} = event.nativeEvent.layout;
							if (height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View>
							<Text style={styles.sectionTitle}>School Schedule</Text>
							{
								this.state.schoolScheduleData.length === 0 ?
									<Text>No school schedule added, please go back to add one</Text> : 
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
							<Text style={styles.sectionTitle}>Fixed Events</Text>
							{
								this.state.fixedEventData.length === 0 ?
									<Text>No fixed events added, please go back to add some</Text> : 
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
							<Text style={styles.sectionTitle}>Non-Fixed Events</Text>
							{
								this.state.nonFixedEventData.length === 0 ?
									<Text>No non-fixed events added, please go back to add some</Text> : 
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
					visible={this.state.showFAB}
					onPress={this.navigateCreationScreen} />

				{tutorialStatus}
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { FixedEventsReducer, NonFixedEventsReducer, CoursesReducer} = state;

	return {
		FixedEventsReducer,
		NonFixedEventsReducer,
		CoursesReducer 
	};
}

export default connect(mapStateToProps, null)(ReviewEvent);