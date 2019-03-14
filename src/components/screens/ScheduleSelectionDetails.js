import React from 'react';
import { Text, Platform, StatusBar, View, StyleSheet, ScrollView } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import updateNavigation from '../NavigationHelper';
import { calendarEventColors, statusBlueColor } from '../../../config';
import { white, blue, black, gray} from '../../styles';
import { DashboardNavigator } from '../../constants/screenNames';

const containerPadding = 10;
const data = {
	fixed: [
		{
			title: 'Test',
			location: 'FSS',
			time: '1PM - 3PM'
		}
	],
	nonFixed: [
		{
			title: 'AI',
			location: 'CBY 032',
			time: '3PM - 9:40PM'
		}
	],
	school: [
		{
			title: 'School',
			location: 'SITE 323',
			time: '8AM - 2PM'
		}
	]
};

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
class ScheduleEvent extends React.Component  {

	constructor(props) {
		super(props);

		// Gets the color for appropriate type of event
		let color;
		switch (props.info.type) {
			case 'fixed':
				color = 'red';
				break;
			case 'school':
				color = 'green';
				break;
			case 'nonFixed':
				color = 'purple';
				break;
		}

		this.state = {
			color
		};
	}

	render() {
		const { color } = this.state;
		const { title, location, time } = this.props.info;

		return (
			<View style={styles.eventContainer}>
				<View style={[styles.scheduleEventColor, {backgroundColor: calendarEventColors[color]}]} />	

				<View style={styles.eventData}>
					<Text style={styles.eventTitle}>{title}</Text>
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
class ScheduleDay extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: this.constructData(props.data),
			day: props.day
		};
	}

	/**
	 * Adds the type of event in data
	 */
	constructData = (data) => {
		let events = [];
		for (let key in data) {
			for (let i = 0; i < data[key].length; i++ ) {
				events.push({
					...data[key][i],
					type: key
				});
			}
		}

		return events;
	}

	render() {
		const { day, data } = this.state;
		return (
			<View style={styles.dayContainer}>
				<Text style={styles.dayTitle}>{day}</Text>

				{
					data.map((info, key) => {
						return <ScheduleEvent key={key} info={info} />;
					})
				}
			</View>
		);
	}
}

/**
 * The screen with more information about the selected generated school schedule
 */
class ScheduleSelectionDetails extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.params.title,
		headerStyle: {
			backgroundColor: blue,
		},
		headerRight: (
			<IconButton
				onPress={navigation.getParam('goBack')}
				icon='delete'
				color='white'
				size={25}
			/>
		),
	});

	constructor(props) {
		super(props);
		this.state = {
			showFAB: true,
			currentY: 0,
		};
		
		// Waits for the animation to finish, then goes to the next screen
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentDidMount() {
		// Sets the onPress for the delete icon in the header
		this.props.navigation.setParams({ goBack: this.goBack });
	}

	/**
	 * Goes to the previous screen, helper method for deleting an event
	 */
	goBack = () => {
		this.props.navigation.pop();
	}

	/**
	 * Hides the FAB when scrolling down
	 */
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

	/**
	 * TODO: Returns the data for the specified weekday
	 */
	getEventForWeekday = () => {
		return data;
	}

	/**
	 * Goes to the next screen
	 */
	nextScreen = () => {
		this.props.navigation.navigate(DashboardNavigator);
	}

	render() {
		const { showFAB } = this.state;
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					backgroundColor={statusBlueColor} />

				<ScrollView onScroll={this.onScroll}>
					<View style={styles.content}>
						{
							days.map((day, key) => {
								return <ScheduleDay key={key} 
									day={day} 
									data={this.getEventForWeekday(day)} />;
							})
						}
					</View>
				</ScrollView>
				
				<FAB
					style={styles.fab}
					icon="check"
					visible={showFAB}
					onPress={this.nextScreen} />
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		index: state.ScheduleSelectionReducer.index
	};
};

export default connect(mapStateToProps, null)(ScheduleSelectionDetails);

const styles = StyleSheet.create({
	container: {
		width: '100%', 
		height: '100%'
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
	
	content: {
		padding: containerPadding
	},

	dayContainer: {
		marginBottom: 15
	},

	dayTitle: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 20,
		marginVertical: 7,
		color: gray
	},

	eventContainer: {
		...Platform.select({
			ios: {
				shadowColor: black,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.3,
				shadowRadius: 3,    
			},
			android: {
				elevation: 5,
			},
		}),
		backgroundColor: white, 
		borderRadius: 5, 
		marginVertical: 7,
		display: 'flex',
		flexDirection: 'row'
	},

	eventData: {
		padding: 7
	},

	eventTitle: {
		fontFamily: 'Raleway-Bold',
		color: gray
	},

	eventTime : {
		color: gray
	},

	eventLocation : {
		color: gray
	},

	scheduleEventColor: {
		width: 20,
		borderBottomLeftRadius: 5, 
		borderTopLeftRadius: 5,
	}
});