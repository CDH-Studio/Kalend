import React from 'react';
import {Platform, StatusBar, StyleSheet, ScrollView, View, Text, Dimensions} from 'react-native';
import {Header} from 'react-navigation';
import { FAB } from 'react-native-paper';
import { blueColor } from '../../../config';
import EventOverview from '../EventOverview';
import TutorialStatus, {HEIGHT} from '../TutorialStatus';
import updateNavigation from '../NavigationHelper';

class ReviewEvent extends React.Component {

	static navigationOptions = {
		title: 'Review Events',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: '#1473E6',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	constructor(props) {
		super(props);
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
		this.state = {
			//Height of Screen
			containerHeight: null,

			schoolScheduleData: [
				{
					courseCode: 'SEG2505',
					dayOfWeek: 'Monday',
					hours: '1PM - 3PM',
					location: 'CBY 202'
				},
				{
					courseCode: 'ITI1500',
					dayOfWeek: 'Friday',
					hours: '8:30AM - 11AM',
					location: 'SITE G104'
				},
				{
					courseCode: 'ITI1500',
					dayOfWeek: 'Friday',
					hours: '8:30AM - 11AM',
					location: 'SITE G104'
				},
				{
					courseCode: 'ITI1500',
					dayOfWeek: 'Friday',
					hours: '8:30AM - 11AM',
					location: 'SITE G104'
				}
			],

			fixedEventData: [
				{
					title: 'Holidays',
					dates: 'Dec 25, 2018 - Jan 1, 2019',
					hours: 'All-Day',
					location: 'Home',
					description: 'Time off from school',
					recurrence: 'None'
					
				},
				{
					title: 'Holidays',
					dates: 'Dec 25, 2018 - Jan 1, 2019',
					hours: 'All-Day',
					location: 'Home',
					description: 'Time off from school',
					recurrence: 'None'
					
				}
			],

			nonFixedEventData: [
				{
					title: 'Computer Science Assignmentfgdfgdfgjdfosjgoidfjgoidjfgid',
					dates: 'Feb 4, 2019',
					duration: '3h',
					recurrence: '3 times',
					priorityLevel: 'Normal',
					location: 'School',
					description: 'Assignement on BlockChains'
				}
			]
			
		};
	}

	/**
	 * Goes to the appropriate Edit Screen
	 */
	navigateEditScreen = (editScreen) => {
		if(this.props.navigation.state.routeName === 'TutorialReviewEvent') {
			this.props.navigation.navigate('TutorialEdit' + editScreen);
		}else {
			this.props.navigation.navigate('DashboardEdit' + editScreen);
		}
	}

	navigateCreationScreen = () => {
		if(this.props.navigation.state.routeName === 'TutorialReviewEvent') {
			this.props.navigation.navigate('TutorialScheduleCreation');
		}else {
			this.props.navigation.navigate('DashboardScheduleCreation');
		}
	}

	render() {
		const containerHeight = Dimensions.get('window').height - Header.HEIGHT;

		//In order to remove the tutorial status if not needed
		let tutorialStatus;
		if(this.props.navigation.state.routeName === 'TutorialReviewEvent') {
			tutorialStatus = <TutorialStatus active={4} color={blueColor} backgroundColor={'white'} />;
		} else {
			tutorialStatus = null;
		}

		return(
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<ScrollView style={styles.scrollView}>
					<View style={styles.content} 
						onLayout={(event) => {
							let {height} = event.nativeEvent.layout;
							if(height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View>
							<Text style={styles.sectionTitle}>School Schedule</Text>
							{this.state.schoolScheduleData.map((i,key) => {
								return <EventOverview key={key} category={'SchoolSchedule'} eventTitle={i.courseCode} date={i.dayOfWeek} time={i.hours} location={i.location} navigateEditScreen = {this.navigateEditScreen} />;
							})}
						</View>

						<View>
							<Text style={styles.sectionTitle}>Fixed Events</Text>
							{this.state.fixedEventData.map((i,key) => {
								return <EventOverview key={key} category={'FixedEvent'} eventTitle={i.title} date={i.dates} time={i.hours} location={i.location} description={i.description} recurrence={i.recurrence} navigateEditScreen = {this.navigateEditScreen} />;
							})}
						</View>

						<View>
							<Text style={styles.sectionTitle}>Non-Fixed Events</Text>
							{this.state.nonFixedEventData.map((i,key) => {
								return <EventOverview key={key} category={'NonFixedEvent'} eventTitle={i.title} date={i.dates} time={i.duration} recurrence={i.recurrence} priorityLevel={i.priorityLevel} location={i.location} description={i.description} navigateEditScreen = {this.navigateEditScreen} />;
							})}
						</View>
					</View>		
				</ScrollView>

				<FAB
					style={styles.fab}
					icon="check"
					onPress={this.navigateCreationScreen} />

				{tutorialStatus}
			</View>
		);
	}
}

const tutorialHeight = HEIGHT;
const headerHeight = Header.HEIGHT;
const containerHeight = containerHeight;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
		marginTop: StatusBar.currentHeight + headerHeight
	},

	content: {
		flex:1,
		justifyContent:'space-evenly',
		height: containerHeight,
		paddingBottom: tutorialHeight + 16,
		paddingHorizontal: 20
	},

	sectionTitle: {
		color: '#565454',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 20,
		marginTop: 20,
		marginBottom: 5
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		zIndex: 1 //To make it go on top of the tutorialStatus
	},
});

export default ReviewEvent;
