import React from 'react';
import { Text, StatusBar, View, ScrollView, BackHandler, Platform } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import { DashboardNavigator } from '../../constants/screenNames';
import { insertGeneratedEvent } from '../../services/service';
import updateNavigation from '../NavigationHelper';
import { clearGeneratedCalendars, clearGeneratedNonFixedEvents, clearNonFixedEvents, clearFixedEvents, clearCourse} from '../../actions';
import { scheduleSelectionDetailsStyle as styles, white, dark_blue, statusBlueColor, blue } from '../../styles';
import { calendarColors } from '../../../config';
export const containerPaddingDetails = 10;

const days = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
];

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
	
	getTime = (time) => {
		time = new Date(time);
		let hours = time.getHours();
		let minutes = time.getMinutes();
		minutes = (minutes < 10) ? `0${minutes}`: minutes;
		let period = hours >= 12 ? 'PM' : 'AM';

		return {hours, minutes, period};
	}

	render() {
		const { color } = this.state;
		const { location, end, start, title, summary } = this.props.info;
		let startTime, endTime, time;
		if (end != undefined) {
			startTime = this.getTime(start.dateTime);
			endTime = this.getTime(end.dateTime);
			time = `${startTime.hours}:${startTime.minutes} ${startTime.period} - ${endTime.hours}:${endTime.minutes} ${endTime.period}`;
		} else {
			const { startTime, endTime } = this.props.info;
			time = `${startTime} - ${endTime}`;
		}

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
		this.setState({day:this.props.day, data: this.props.data});
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

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.params.title,
		headerStyle: {
			backgroundColor: white
		},
		headerRight: (
			<IconButton
				onPress={navigation.getParam('goBack')}
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
				'Monday': []

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
			'Sunday': [],
			'Monday': [],
			'Tuesday': [],
			'Wednesday': [],
			'Thursday': [],
			'Friday': [],
			'Saturday': []
		};

		if (data.schoolEvents.length != 0) {
			data.schoolEvents.forEach(event => {
				event.type = 'school';
				temp_days[event.dayOfWeek].push(event);
			});
		}

		if (data.fixedEvents.length != 0) {
			data.fixedEvents.forEach(event => {
				event.type = 'fixed';
				let day = new Date(event.startDate).getDay();
				temp_days[days[day]].push(event);
			});
		}

		if (data.aiEvents) {
			data.aiEvents.forEach(event => {
				event.type = 'nonFixed';
				let day = new Date(event.start.dateTime).getDay();
				temp_days[days[day]].push(event);
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
					backgroundColor={statusBlueColor} />

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
				
				<FAB
					style={styles.fab}
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

	fixedEventsColor = calendarColors.map(i => {
		if (Object.keys(i)[0] === fixedEventsColor) {
			return Object.values(i)[0];
		}
	});

	nonFixedEventsColor = calendarColors.map(i => {
		if (Object.keys(i)[0] === nonFixedEventsColor) {
			return Object.values(i)[0];
		}
	});

	courseColor = calendarColors.map(i => {
		if (Object.keys(i)[0] === courseColor) {
			return Object.values(i)[0];
		}
	});

	return {
		index,
		GeneratedNonFixedEventsReducer,
		fixedEventsColor,
		nonFixedEventsColor,
		courseColor
	};
};

export default connect(mapStateToProps, null)(ScheduleSelectionDetails);