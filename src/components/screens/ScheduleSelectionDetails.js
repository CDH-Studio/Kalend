import React from 'react';
import { Text, StatusBar, View, ScrollView, BackHandler, Platform } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import { calendarColors } from '../../../config/config';
import { DashboardNavigator } from '../../constants/screenNames';
import { insertGeneratedEvent } from '../../services/service';
import { getStrings } from '../../services/helper';
import updateNavigation from '../NavigationHelper';
import { clearGeneratedCalendars, clearGeneratedNonFixedEvents, clearNonFixedEvents, clearFixedEvents, clearCourse} from '../../actions';
import { scheduleSelectionDetailsStyle as styles, white, dark_blue, blue } from '../../styles';

const moment = require('moment');

export const containerPaddingDetails = 10;

/**
 * An event in the list of events
 * 
 * @prop {Object} info Information about the event
 * @prop {String} info.type The type of event
 * @prop {String} info.title The title of the event
 * @prop {String} info.location The location of the event
 * @prop {String} info.time The time of the event
 */
class ScheduleEvent extends React.PureComponent  {

	constructor(props) {
		super(props);

		// Gets the color for appropriate type of event
		let color;
		switch (props.info.type) {
			case 'fixed':
				color = this.props.colors.fixedEventsColor;
				break;
			case 'school':
				color = this.props.colors.courseColor;
				break;
			case 'nonFixed':
				color = this.props.colors.nonFixedEventsColor;
				break;
		}

		this.state = {
			color
		};
	}

	render() {
		const { color } = this.state;
		const { location, time, title, summary } = this.props.info;

		let actualTitle =  (title == undefined) ? summary: title;

		return (
			<View style={styles.eventContainer}>
				<View style={[styles.scheduleEventColor, {backgroundColor: color}]} />	

				<View style={styles.eventData}>
					<Text style={styles.eventTitle}>{actualTitle}</Text>

					<Text style={styles.eventLocation}>{location}</Text>
					
					<Text style={styles.eventTime}>{time}</Text>
				</View>
			</View>
		);
	}
}

/**
 * A portion (day) of the list of event
 * 
 * @prop {String} day The day of the event
 * @prop {Object} data Information about the event
 * @prop {String} data.title The title of the event
 * @prop {String} data.location The location of the event
 * @prop {String} data.time The time of the event
 */
class ScheduleDay extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			data:[ ],
			day: props.day
		};
	}
	
	componentWillMount() {
		let { data, day } = this.props;

		// Formats the time
		data.map((info) => {
			let { end, start } = info;
			let startTime, endTime, time;

			if (info.end != undefined) {
				startTime = this.getTime(start.dateTime);
				endTime = this.getTime(end.dateTime);
				time = `${startTime.hours}:${startTime.minutes} ${startTime.period} - ${endTime.hours}:${endTime.minutes} ${endTime.period}`;
			} else {
				const { startTime, endTime } = info;
				time = `${startTime} - ${endTime}`;
			}

			info.time = time;
		});

		// Sorts the event
		data.sort((a,b) => new moment(a.time, 'h:mm A') - new moment(b.time, 'h:mm A'));

		this.setState({day, data});
	}
	
	getTime = (time) => {
		time = new Date(time);
		let hours = time.getHours();
		let minutes = time.getMinutes();
		minutes = (minutes < 10) ? `0${minutes}`: minutes;
		let period = hours >= 12 ? 'PM' : 'AM';

		hours = hours > 12 ? hours - 12 : hours;
		return {hours, minutes, period};
	}

	render() {
		const { day, data } = this.state;
		return (
			<View style={styles.dayContainer}>
				<Text style={styles.dayTitle}>{day}</Text>

				{
					data.map((info, key) => {
						return <ScheduleEvent key={key} info={info} colors={this.props.colors} />;
					})
				}
			</View>
		);
	}
}

/**
 * The screen with more information about the selected generated school schedule
 */
class ScheduleSelectionDetails extends React.PureComponent {

	strings = getStrings().ScheduleSelectionDetails;

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.params.title,
		headerStyle: {
			backgroundColor: white
		},
		headerRight: (
			<IconButton onPress={navigation.getParam('goBack')}
				icon='delete'
				color={dark_blue}
				size={25}
			/>
		),
	});

	constructor(props) {
		super(props);
		this.state = {
			showFAB: true,
			currentY: 0,
			daysTemp: {
				[this.strings.days[1]]: []
			}
		};
		
		// Waits for the animation to finish, then goes to the next screen
		updateNavigation('ScheduleSelectionDetails', props.navigation.state.routeName);
	}

	componentDidMount() {
		this.props.navigation.setParams({ goBack: this.deleteCalendar });
	}

	deleteCalendar = async () => {
		this.props.navigation.state.params.delete(this.props.index);
		this.goBack();
	}

	componentWillMount() {
		this.seperateEventsIntoDays(this.props.navigation.state.params.data);
		this.setState({data: this.props.navigation.state.params.data});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	handleBackButton = () => {
		this.props.navigation.pop();
		return true;
	}

	seperateEventsIntoDays = (data) =>{
		const temp_days = {
			[this.strings.days[0]]: [],
			[this.strings.days[1]]: [],
			[this.strings.days[2]]: [],
			[this.strings.days[3]]: [],
			[this.strings.days[4]]: [],
			[this.strings.days[5]]: [],
			[this.strings.days[6]]: []
		};

		if (data.schoolEvents.length != 0) {
			data.schoolEvents.forEach(event => {
				event.type = 'school';
				if ('daysEn' in this.strings) {
					temp_days[this.strings.days[this.strings.daysEn.indexOf(event.dayOfWeek)]].push(event);
				} else {
					temp_days[event.dayOfWeek].push(event);
				}
			});
		}

		if (data.fixedEvents.length != 0) {
			data.fixedEvents.forEach(event => {
				event.type = 'fixed';
				let day = new Date(event.startDate).getDay();
				temp_days[this.strings.days[day]].push(event);
			});
		}

		if (data.aiEvents) {
			data.aiEvents.forEach(event => {
				event.type = 'nonFixed';
				let day = new Date(event.start.dateTime).getDay();
				temp_days[this.strings.days[day]].push(event);
			});
		}
		
		this.setState({daysTemp: temp_days});
	}

	/**
	 * Goes to the previous screen, helper method for deleting an event
	 */
	goBack = () => {
		this.props.navigation.pop();
	}

	/**
	 * TODO: Returns the data for the specified weekday
	 */
	getEventForWeekday = (day) => {
		let data = this.state.daysTemp[day];
		return data;
	}

	/**
	 * Goes to the next screen
	 */
	nextScreen = () => {
		if (this.state.data.aiEvents) {
			this.state.data.aiEvents.forEach(event => {
				insertGeneratedEvent(event);
			});
		}
		this.clearEvents();
		this.props.navigation.navigate(DashboardNavigator);
	}

	clearEvents = () => {
		this.props.dispatch(clearGeneratedCalendars());
		this.props.dispatch(clearGeneratedNonFixedEvents());
		this.props.dispatch(clearNonFixedEvents());
		this.props.dispatch(clearFixedEvents());
		this.props.dispatch(clearCourse());
	}

	render() {
		const { showFAB, daysTemp } = this.state;
		const objectArray  = Object.keys(daysTemp);
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={'rgba(0, 0, 0, 0.5)'} />

				<ScrollView>
					<View style={styles.content}>
						{
							objectArray.map((day, key) => {
								return (<ScheduleDay key={key} 
									colors={{
										courseColor: this.props.courseColor,
										fixedEventsColor: this.props.fixedEventsColor,
										nonFixedEventsColor: this.props.nonFixedEventsColor,
									}}
									day={day} 
									data={this.getEventForWeekday(day)} />);
							})
						}
					</View>
				</ScrollView>
				
				<FAB style={styles.fab}
					theme={{colors:{accent:blue}}}
					icon="check"
					visible={showFAB}
					onPress={this.nextScreen} />
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { index } = state.ScheduleSelectionReducer;
	const { GeneratedNonFixedEventsReducer } = state;
	let { fixedEventsColor, nonFixedEventsColor, courseColor } = state.CalendarReducer;

	for (let i = 0; i < calendarColors.length; i++) {
		let key = Object.keys(calendarColors[i])[0];
		let value = Object.values(calendarColors[i])[0];

		switch(key) {
			case fixedEventsColor:
				fixedEventsColor = value;
				break;
			
			case nonFixedEventsColor:
				nonFixedEventsColor = value;
				break;
				
			case courseColor:
				courseColor = value;
				break;
		}
	}

	if (!fixedEventsColor) {
		fixedEventsColor = state.CalendarReducer.calendarColor;
	}

	if (!nonFixedEventsColor) {
		nonFixedEventsColor = state.CalendarReducer.calendarColor;
	}

	if (!courseColor) {
		courseColor = state.CalendarReducer.calendarColor;
	}

	return {
		index,
		GeneratedNonFixedEventsReducer,
		fixedEventsColor,
		nonFixedEventsColor,
		courseColor
	};
};

export default connect(mapStateToProps, null)(ScheduleSelectionDetails);