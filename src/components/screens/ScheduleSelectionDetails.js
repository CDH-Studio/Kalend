import React from 'react';
import {Text, Platform, StatusBar, View, StyleSheet, ScrollView} from 'react-native';
import { blueColor, calendarEventColors } from '../../../config';
import { FAB, IconButton } from 'react-native-paper';
import updateNavigation from '../NavigationHelper';
import { connect } from 'react-redux';

class ScheduleEvent extends React.Component  {

	constructor(props) {
		super(props);
		console.log(props);
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
		const {title, location, time} = this.props.info;
		return (
			<View style={styles.eventContainer}>
				<View style={{
					width: 35,
					borderBottomLeftRadius: 5, 
					borderTopLeftRadius: 5,
					backgroundColor: calendarEventColors[color]
				}} />	
				<View style={styles.eventData}>
					<Text style={styles.eventTitle}>{title}</Text>
					<Text style={styles.eventLocation}>{location}</Text>
					<Text style={styles.eventTime}>{time}</Text>
				</View>
			</View>
		);
	}
}

class ScheduleDay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: this.constructData(props.data),
			day: props.day
		};
	}

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
		const {day, data} = this.state;
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

class ScheduleSelectionDetails extends React.Component {
	data = {
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
				// summary,
				// location,
				// end: {
				// 	dateTime:
				// },
				// start: {
				// 	dateTime:
				// },

			}
		]
	}

	days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	]

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.params.title,
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerStyle: {
			backgroundColor: blueColor,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
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

	componentDidMount() {
		this.props.navigation.setParams({ goBack: this.goBack });
	}

	goBack = () => {
		this.props.navigation.pop();
	}

	constructor(props) {
		super(props);
		this.state = {
			showFAB: true,
			currentY: 0,
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	// Hides the FAB when scrolling down
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

	getEventForWeekday = () => {
		return this.data;
	}

	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />
				<ScrollView onScroll={this.onScroll}>
					<View style={styles.content}>

						{
							this.days.map((day, key) => {
								return <ScheduleDay key={key} day={day} data={this.getEventForWeekday(day)} />;
							})
						}

					</View>
				</ScrollView>
				
				<FAB
					style={styles.fab}
					icon="check"
					visible={this.state.showFAB}
					onPress={() => this.props.navigation.navigate('DashboardNavigator')} />
			</View>
		);
	}
}

const containerPadding = 10;
const styles = StyleSheet.create({

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
	
	content: {
		padding: containerPadding,
	},

	dayContainer: {
		marginBottom: 15
	},

	dayTitle: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 20,
		marginVertical: 7
	},

	eventContainer: {
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 2,    
			},
			android: {
				elevation: 5,
			},
		}),
		backgroundColor: 'white', 
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
	}

});

function mapStateToProps(state) {
	const index = state.ScheduleSelectionReducer.index;
	return {
		index
	};
}

export default connect(mapStateToProps, null)(ScheduleSelectionDetails);