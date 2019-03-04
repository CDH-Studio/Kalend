import React from 'react';
import {Platform, Dimensions, StyleSheet, StatusBar, Text, View, ScrollView, TextInput, Picker, TouchableOpacity, ActionSheetIOS} from 'react-native';
import {Header} from 'react-navigation';
import { blueColor, statusBlueColor } from '../../../config';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import updateNavigation from '../NavigationHelper';
import {ADD_COURSE, CLEAR_COURSE} from '../../constants';
import { connect } from 'react-redux';
import { store } from '../../store';

const viewHeight = 718.8571166992188;

class Course extends React.Component {

	// Style for Navigation Bar
	static navigationOptions = {
		title: 'Add Courses',
		headerTintColor: 'white',
		headerTitleStyle: {fontFamily: 'Raleway-Regular'},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: blueColor,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	// Constructor and States
	constructor(props) {
		super(props);
		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = null;
		
		if(viewHeight < containerHeightTemp) {
			containerHeight = containerHeightTemp;
		}

		this.state = { 
			//Height of Screen
			containerHeight,
			eventID: Date.now()
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		if (this.props.navigation.state.routeName !== 'TutorialAddCourse') {
			let courses = store.getState().CoursesReducer;
			let selected = store.getState().NavigationReducer.reviewEventSelected;

			this.setState({...courses[selected]});
		} else {
			this.resetField();
		}	
	}

	/**
	 * Returns the time formatted with the AM/PM notation
	 * 
	 * @param {String} time The time expressed in the 24 hours format
	 */
	getTwelveHourTime(time) {
		let temp = time.split(' ');
		let amOrPm = temp[1];

		let info = time.split(':');
		time = new Date();

		time.setHours(parseInt(info[0]));
		time.setMinutes(parseInt(info[1]));

		let currentHour = time.getHours();
		let currentMinute = time.getMinutes();

		if(currentHour > 12) {
			currentHour = currentHour % 12;
			time.setHours(currentHour);
		}

		if(currentMinute < 10) {
			currentMinute = '0' + currentMinute;
		}

		return time.getHours() + ':' + currentMinute + ' ' + amOrPm;
	}

	/**
	 * Gets the current time AM or PM
	 */
	getAmPm() {
		let hours = new Date().getHours();
		return (hours >= 12) ? ' PM' : ' AM';
	}

	enableEndTime() {
		if(this.state.disabledEndTime === true) {
			this.setState({endTime: this.state.startTime});
			return false;
		}else {
			//do nothing
		}
	}

	/**
	 * 
	 */
	setMinEndTime() {
		let min = new Date();

		if (this.state.startDate === this.state.endDate) {
			this.state.endTime = this.state.startTime;
			min = min.toLocaleTimeString();
			min = this.state.startTime;
			return min;
		}
	}

	/**
	 * Analyzes the input times and make sure the ranges make sense
	 * 
	 * @param {String} startTime The start time received from the time dialog
	 * @param {String} endTime The end time received from the time dialog
	 */
	beforeStartTime = (startTime, endTime) => {
		let startCheck = true;

		// Check if an end time has been specified, if not, use the state end time
		if (endTime === undefined) {
			endTime = this.state.endTime;
		}

		// Check if an start time has been specified, if not, use the state start time
		// and specify that the startTime wasn't given by changing the variable startCheck
		if (startTime === undefined) {
			startTime = this.state.startTime;
			startCheck = false;
		}

		// Fix the undefined bug if you haven't set the end time (since the seconds are included in the time)
		if (endTime.split(':').length === 3) {
			let endTimeSplit = endTime.split(':');
			let endTimeSplitSpace = endTime.split(' ');

			endTime = endTimeSplit[0] + ':' + endTimeSplit[1] + ' ' + endTimeSplitSpace[1];
		}

		// Analyzes the start time, and converts it to a date
		let start = this.getDateObject(startTime);

		// End Time
		let end = this.getDateObject(endTime);

		// Comparing start and end time
		if (startCheck) {
			if (start > end) {
				return startTime;
			} else {
				return endTime;
			}
		} else {
			if (end < start) {
				return endTime;
			} else {
				return startTime;
			}
		}
	}

	/**
	 * Converts a string formatted like ##:## PM or AM to a JavaScript object
	 * 
	 * @param {String} time The string representing the time
	 * 
	 * @returns {Date} The JavaScript date object equivalent of the string
	 */
	getDateObject = (time) => {
		// Gets the AM/PM
		let tempTime = time.split(' ');
		let isPm = tempTime[1].trim().toLowerCase() === 'pm';

		// Gets the hours and minutes
		let timeContent = tempTime[0].split(':');
		let hours = parseInt(timeContent[0]);
		let minutes = parseInt(timeContent[1]);

		// Adds 12 hours if its PM and not equal to 12
		if (isPm && hours !== 12) {
			hours += 12;
		}

		// Creates a JavaScript object
		let date = new Date();
		date.setHours(hours, minutes);

		return date;
	}

	/**
	 * Opens up the iOS action sheet to set the recurrence
	 */
	dayOfWeekOnClick = () => {
		return ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Cancel'],
				cancelButtonIndex: 7,
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this.state.dayOfWeekValue = 'MONDAY';
				} else if (buttonIndex === 1) {
					this.state.dayOfWeekValue = 'TUESDAY';
				} else if (buttonIndex === 2) {
					this.state.dayOfWeekValue = 'WEDNESDAY';
				} else if (buttonIndex === 3) {
					this.state.dayOfWeekValue = 'THURSDAY';
				} else if (buttonIndex === 4) {
					this.state.dayOfWeekValue = 'FRIDAY';
				} else if (buttonIndex === 5) {
					this.state.dayOfWeekValue = 'SATURDAY';
				} else if (buttonIndex === 6) {
					this.state.dayOfWeekValue = 'SUNDAY';
				}
				this.forceUpdate();
			},
		);
	}


	nextScreen = () => {
		if (this.props.navigation.state.routeName === 'TutorialAddCourse') {
			this.addAnotherEvent();
			this.props.navigation.navigate('TutorialFixedEvent', {update:false});
		} else {
			let events = this.props.CoursesReducer;
			let arr = [];

			events.map((event) => {
				if (event.eventID === this.state.eventID) {
					arr.push(this.state);
				} else {
					arr.push(event);
				}
			});

			this.props.dispatch({
				type: CLEAR_COURSE,
			});

			arr.map((event) => {
				this.props.dispatch({
					type: ADD_COURSE,
					event
				});
			});

			this.props.navigation.navigate('TutorialReviewEvent', {changed:true});
		}
	}

	addAnotherEvent = () => {
		this.props.dispatch({
			type: ADD_COURSE,
			event: this.state
		});
		this.resetField();
	}

	
	resetField = () => {
		this.setState({
			//Course Code
			courseCode: '',
			
			//Time section
			dayOfWeek: 'Monday',
			dayOfWeekValue: 'MONDAY',

			startTime: new Date().toLocaleTimeString(),
			amPmStart: this.getAmPm(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime: true,
			amPmEnd: this.getAmPm(),

			//Other Information
			location: ''
		});
	}

	render() {
		let addCourseButton;
		let nextButton;

		if(this.props.navigation.state.routeName === 'TutorialAddCourse') {
			addCourseButton = 
				<TouchableOpacity style={styles.buttonEvent} onPress={this.addAnotherEvent}> 
					<Text style={styles.buttonEventText}>ADD ANOTHER{'\n'}COURSE</Text>
				</TouchableOpacity>;
			nextButton = 
			<TouchableOpacity style={styles.buttonNext} onPress={this.nextScreen}>
				<Text style={styles.buttonNextText}>NEXT</Text>
			</TouchableOpacity>;
		} else {
			addCourseButton = null;
			nextButton = 
				<TouchableOpacity style={styles.buttonNext} onPress={this.nextScreen}>
					<Text style={styles.buttonNextText}>DONE</Text>
				</TouchableOpacity>;
		}
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={statusBlueColor} />

				<ScrollView>
					<View style={styles.content}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add all your courses from your school schedule</Text>
							<FontAwesome5 name="university" size={130} color={blueColor}/>
						</View>

						<View style={styles.textInput}>
							<MaterialIcons name="class" size={30} color={blueColor} />
							<View style={styles.textInputBorder}>
								<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} 
									placeholder="Course Code" 
									onChangeText={(courseCode) => this.setState({courseCode})} 
									value={this.state.courseCode}/>
							</View>
						</View>

						<View style={styles.textInput}>
							<Text style={styles.dayOfWeekTitle}>Day of Week</Text>

							<View style={styles.dayOfWeekBorder}>
								{
									Platform.OS === 'ios' ? 
										<Text onPress={this.dayOfWeekOnClick}>{this.state.dayOfWeekValue}</Text>
										:	
										<Picker style={styles.dayOfWeekValues} 
											selectedValue={this.state.dayOfWeek} 
											onValueChange={(dayOfWeekValue) => this.setState({dayOfWeek: dayOfWeekValue})}>
											<Picker.Item label="Monday" value="MONDAY" />
											<Picker.Item label="Tuesday" value="TUESDAY" />
											<Picker.Item label="Wednesday" value="WEDNESDAY" />
											<Picker.Item label="Thursday" value="THURSDAY" />
											<Picker.Item label="Friday" value="FRIDAY" />
											<Picker.Item label="Saturday" value="SATURDAY" />
											<Picker.Item label="Sunday" value="SUNDAY" />
										</Picker>
								}
							</View>
						</View>
						<View style={styles.timeSection}>
							<View style={styles.time}>
								<Text style={styles.blueTitle}>Start Time</Text>
								<DatePicker showIcon={false} 
									time={this.state.startTime} 
									mode="time" 
									customStyles={{
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular', color:'#565454'}, 
										placeholderText:{color:'#565454'}
									}}
									placeholder={this.getTwelveHourTime(this.state.startTime.split(':')[0] + ':' + this.state.startTime.split(':')[1] +  this.state.amPmStart)} 
									format="HH:mm A" 
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									is24Hour={false}
									onDateChange={(startTime) => {
										this.setState({startTime, endTime: this.beforeStartTime(this.getTwelveHourTime(startTime))});
										this.setState({ disabledEndTime: this.enableEndTime()});
									}}/>
							</View>

							<View style={styles.time}>
								<Text style={styles.blueTitle}>End Time</Text>
								<DatePicker showIcon={false} 
									time={this.state.endTime} 
									mode="time" 
									disabled= {this.state.disabledEndTime}
									customStyles={{
										disabled:{backgroundColor: 'transparent'}, 
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular'}, 
										placeholderText:{
											color:'#565454',
											textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}}}
									placeholder={this.getTwelveHourTime(this.state.endTime.split(':')[0] + ':' + this.state.endTime.split(':')[1] +  this.state.amPmEnd)} 
									format="HH:mm A" 
									minDate={this.state.minEndTime}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									is24Hour={false}
									onDateChange={(endTime) => this.setState({ endTime, startTime: this.beforeStartTime(undefined, this.getTwelveHourTime(endTime))})}/>

							</View>
						</View>

						<View style={styles.textInput}>
							<MaterialIcons name="location-on" size={30} color={blueColor} />
							<View style={styles.textInputBorder}>
								<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} 
									placeholder="Location" 
									onChangeText={(location) => this.setState({location})} 
									value={this.state.location}/>
							</View>
						</View>

						<View style={styles.buttons}>
							{addCourseButton}

							{nextButton}
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const headerHeight = Header.HEIGHT;
const containerHeight = Dimensions.get('window').height - Header.HEIGHT;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flex:1,
		justifyContent:'space-evenly',
		height: containerHeight,
		marginTop: StatusBar.currentHeight + headerHeight,
		paddingHorizontal: 20
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	text: {
		width: 210,
		paddingRight: 15,
		fontFamily: 'Raleway-Regular',
		color: '#565454',
		fontSize: 20,
		textAlign: 'right'
	},

	textInput: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginRight: 5,
		height: 40
	},

	textInputBorder: {
		borderBottomColor: 'lightgray',
		borderBottomWidth: 1,
		width: '87%',
		marginLeft: 10,
	},

	dayOfWeekBorder: {
		borderBottomColor: 'lightgray',
		borderBottomWidth: 1,
		width: '65%',
		marginLeft: 10,
	},

	dayOfWeekTitle: {
		color: '#1473E6',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		marginRight: 5,
		marginLeft: 5
	},

	blueTitle: {
		color: '#1473E6',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 88
	},

	dayOfWeekValues:{
		color: '#565454',
		height: 40,
		width: '105%',
		marginLeft: -5,
		marginBottom:-8
	},

	time: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	},

	buttonEvent: {
		borderRadius: 12,
		backgroundColor: blueColor,
		width: 150,
		height: 57.9,
		elevation: 4,
		marginRight: 25,
		justifyContent:'center'
	},

	buttonEventText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		textAlign: 'center',
		padding: 8
	},

	buttonNext: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		width: 100,
		height: 58,
		borderWidth: 3,
		borderColor: blueColor,
		elevation: 4,
		justifyContent:'center'
	},

	buttonNextText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: blueColor,
		textAlign: 'center',
		padding: 8
	}
});


function mapStateToProps(state) {
	const { CoursesReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		CourseState: CoursesReducer[selected],
		CoursesReducer
	};
}
export default connect(mapStateToProps, null)(Course);