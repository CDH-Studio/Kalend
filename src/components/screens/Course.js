import React from 'react';
import { Platform, Dimensions, StatusBar, Text, View, ScrollView, TextInput, Picker, ActionSheetIOS, KeyboardAvoidingView, findNodeHandle } from 'react-native';
import DatePicker from 'react-native-datepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { updateCourses, addCourse } from '../../actions';
import BottomButtons from '../BottomButtons';
import { CourseRoute, SchoolScheduleRoute, DashboardNavigator, ReviewEventRoute, SchoolInformationRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { courseStyles as styles, statusBlueColor, gray, dark_blue, blue, white } from '../../styles';

const moment = require('moment');

const viewHeight = 774.8571166992188;
const containerHeight = Dimensions.get('window').height - Header.HEIGHT;

/**
 * Permits the user to input their school schedule manually 
 * or to edit the previously entred courses
 */
class Course extends React.PureComponent {

	days = [
		'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	]

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.routeName === CourseRoute ? 'Add Courses' : 'Edit Course',
		headerStyle: {
			backgroundColor: white,
		}
	});

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		this.state = { 
			containerHeight,

			summary: '',

			dayOfWeek: 'Monday',
			dayOfWeekValue: 'Monday',

			startTime: moment().format('h:mm A'),

			endTime: moment().format('h:mm A'),
			minEndTime: moment().format('h:mm A'),
			disabledEndTime: true,

			location: ''
		};

		updateNavigation('Course', props.navigation.state.routeName);
	}

	componentWillMount() {
		this.resetField();
		if (this.props.navigation.state.routeName !== CourseRoute) {
			this.setState({...this.props.CourseState});

			const { dayOfWeekValue } = this.state;
			const { dayOfWeek } = this.props.CourseState;
			if (dayOfWeek !== dayOfWeekValue) {
				this.setState({dayOfWeekValue: dayOfWeek});
			}

			if ('end' in this.props.CourseState && !('endTime' in this.props.CourseState)) {
				this.setState({endTime: this.convertTimeWithSeconds(new Date(this.props.CourseState.end.dateTime).toLocaleTimeString())});
			}

			if ('start' in this.props.CourseState && !('startTime' in this.props.CourseState)) {
				this.setState({startTime: this.convertTimeWithSeconds(new Date(this.props.CourseState.start.dateTime).toLocaleTimeString())});
			}

			this.setState({disabledEndTime: false});
		}	
	}

	/**
	 * Enables endTime and sets it to the startTime
	 */
	enableEndTime() {
		if (this.state.disabledEndTime === true) {
			this.setState({endTime: this.state.startTime});
			return false;
		} else {
			//do nothing
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

		// Check if a start time has been specified, if not, use the state start time
		// and specify that the startTime wasn't given by changing the variable startCheck
		if (startTime === undefined) {
			startTime = this.state.startTime;
			startCheck = false;
		}

		// Fix the undefined bug if you haven't set the end time (since the seconds are included in the time)
		if (endTime.split(':').length === 3) {
			endTime = this.convertTimeWithSeconds(endTime);
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

	convertTimeWithSeconds = (time) => {
		let endTimeSplit = time.split(':');
		let endTimeSplitSpace = time.split(' ');

		time = endTimeSplit[0] + ':' + endTimeSplit[1] + ' ' + endTimeSplitSpace[1];
		return time;
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
					this.state.dayOfWeekValue = 'Monday';
				} else if (buttonIndex === 1) {
					this.state.dayOfWeekValue = 'Tuesday';
				} else if (buttonIndex === 2) {
					this.state.dayOfWeekValue = 'Wednesday';
				} else if (buttonIndex === 3) {
					this.state.dayOfWeekValue = 'Thursday';
				} else if (buttonIndex === 4) {
					this.state.dayOfWeekValue = 'Friday';
				} else if (buttonIndex === 5) {
					this.state.dayOfWeekValue = 'Saturday';
				} else if (buttonIndex === 6) {
					this.state.dayOfWeekValue = 'Sunday';
				}
				this.forceUpdate();
			},
		);
	}

	/**
	 * Validates the CourseCode and EndTime fields
	 */
	fieldValidation = () => {
		let validated = true;

		if (this.state.summary === '') {
			this.setState({courseCodeValidated: false});
			validated = false;
		} else {
			this.setState({courseCodeValidated: true});
		}
		
		if (this.state.disabledEndTime === true) {
			this.setState({endTimeValidated: false});
			validated = false;
		} else {
			this.setState({endTimeValidated: true});
		}

		return validated;
	}

	/**
	 * Adds the event in the calendar
	 */
	nextScreen = () => {
		if (this.props.navigation.state.routeName === CourseRoute) {
			if (this.addAnotherEvent()) {
				this.props.navigation.pop();
			}
		} else {
			let validated = this.fieldValidation();
			if (!validated) {
				return;
			}
			
			this.props.dispatch(updateCourses(this.props.selectedIndex, this.state));
			this.props.navigation.pop();
		}
	}

	/**
	 * Adds the event to the calendar and resets the fields
	 */
	addAnotherEvent = () => {
		let validated = this.fieldValidation();
		if (!validated) {
			this.setState({
				snackbarText: 'Invalid fields, please review to add course',
				snackbarVisible: true,
				snackbarTime: 5000
			});
			return false;
		}

		// gets the next weekday date
		let date = this.getNextWeekdayDate();

		let endtime = new Date(date.getTime());
		endtime = this.getDateFromTimeString(this.state.endTime, endtime);
		endtime = endtime.toJSON();

		let starttime = new Date(date.getTime());
		starttime = this.getDateFromTimeString(this.state.startTime, starttime);
		starttime = starttime.toJSON();

		return this.setState({
			end: {
				timeZone: 'America/Toronto',
				dateTime: endtime
			},
			start: {
				timeZone: 'America/Toronto',
				dateTime: starttime
			}
		}, () => {
			this.props.dispatch(addCourse(this.state));

			if (validated) {
				this.resetField();
				this.refs._scrollView.scrollTo({x: 0});
				this.setState({
					snackbarText: 'Course successfully added',
					snackbarVisible: true,
					snackbarTime: 3000
				});
			}
			return validated;
		});
	}

	getNextWeekdayDate = () => {
		let date = new Date();
		date.setDate(date.getDate() + ((7-date.getDay())%7+this.days.indexOf(this.state.dayOfWeek)) % 7);

		return date;
	}

	getDateFromTimeString = (timeString, currentDate) => {
		if (currentDate === undefined) {
			currentDate = new Date();
		}

		// cleans up the time in the state
		let info = timeString.split(' ').map(i => i.split(':'));
		currentDate.setHours( 
			parseInt(info[0][0]) + (info[1][0] === 'AM' ? 0 : 12), 
			parseInt(info[0][1]), 
			0,
			0);
			
		return currentDate;
	}

	/**
	 * Reset the fields of the form
	 */
	resetField = () => {
		this.setState({
			summary: '',
			courseCodeValidated: true,
			
			dayOfWeek: 'Monday',
			dayOfWeekValue: 'Monday',

			startTime: moment().format('h:mm A'),

			endTime: moment().format('h:mm A'),
			minEndTime: moment().format('h:mm A'),
			disabledEndTime: true,
			endTimeValidated: true,

			location: '',
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000,

			recurrence: 'RRULE:FREQ=WEEKLY;UNTIL=20190327'
		});
	}

	scrollToInput = (inputFieldRef, keyboardScrollHeight) => {
		const scrollResponder = this.refs._scrollView.getScrollResponder();
		const inputHandle = findNodeHandle(inputFieldRef);

		scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
			inputHandle,
			keyboardScrollHeight,
			true
		);
	}

	render() {
		const { dayOfWeekValue, snackbarVisible, snackbarText, snackbarTime } = this.state;

		let addEventButtonText;
		let addEventButtonFunction;
		let errorCourseCode;
		let errorEndTime;
		let showNextButton = true;

		if (!this.state.courseCodeValidated) {
			errorCourseCode = <Text style={styles.errorCourseCode}>Course Code cannot be empty.</Text>;
		} else {
			errorCourseCode = null;
		}

		if (!this.state.endTimeValidated) {
			errorEndTime = <Text style={styles.errorEndTime}>Please select a Start and End Time.</Text>;
		} else {
			errorEndTime = null;
		}
		
		if (this.props.navigation.state.routeName === CourseRoute) {
			addEventButtonText = 'Add';
			addEventButtonFunction = this.addAnotherEvent;
		} else {
			addEventButtonText = 'Done';
			addEventButtonFunction = this.nextScreen;
			showNextButton = false;
		}

		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

				<KeyboardAvoidingView 
					behavior={Platform.OS === 'ios' ? 'padding' : null}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
					<ScrollView ref='_scrollView'>
						<View style={[styles.content, {height: containerHeight}]}>
							<View style={styles.instruction}>
								<Text style={styles.text}>Add all your courses from your school schedule</Text>
								<FontAwesome5 name="university"
									size={130}
									color={dark_blue}/>
							</View>
						
							<View>
								<View style={styles.textInput}>
									<MaterialIcons name="class"
										size={30}
										color={blue} />

									<View style={[styles.textInputBorder, {borderBottomColor: !this.state.courseCodeValidated ? '#ff0000' : '#D4D4D4'}]}>
										<TextInput style={styles.textInputText} 
											maxLength={1024}
											placeholder="Course Code" 
											returnKeyType = {'next'}
											onSubmitEditing={() => this.refs.locationInput.focus()}
											blurOnSubmit={false}
											onChangeText={(courseCode) => this.setState({summary: courseCode, courseCodeValidated: true})} 
											value={this.state.summary} />
									</View>
								</View>

								{errorCourseCode}
							</View>

							<View style={styles.dayOfWeekSection}>
								<Text style={styles.dayOfWeekTitle}>Day of Week</Text>

								<View style={styles.dayOfWeekBorder}>
									{
										Platform.OS === 'ios' ? 
											<View>
												<MaterialIcons name="arrow-drop-down"
													size={20}
													style={{position: 'absolute', right: 0}} />
												<Text style={{padding: 1}} 
													onPress={this.dayOfWeekOnClick}>
													{dayOfWeekValue.charAt(0).toUpperCase() + dayOfWeekValue.slice(1).toLowerCase()}
												</Text>
											</View>
											:	
											<Picker style={styles.dayOfWeekValues} 
												selectedValue={this.state.dayOfWeek} 
												onValueChange={(dayOfWeekValue) => this.setState({dayOfWeek: dayOfWeekValue, dayOfWeekValue})}>
												<Picker.Item label="Monday" value="Monday" />
												<Picker.Item label="Tuesday" value="Tuesday" />
												<Picker.Item label="Wednesday" value="Wednesday" />
												<Picker.Item label="Thursday" value="Thursday" />
												<Picker.Item label="Friday" value="Friday" />
												<Picker.Item label="Saturday" value="Saturday" />
												<Picker.Item label="Sunday" value="Sunday" />
											</Picker>
									}
								</View>
							</View>
							<View style={styles.timeSection}>
								<View style={styles.time}>
									<Text style={styles.blueTitle}>Start Time</Text>
									<DatePicker showIcon={false} 
										date={this.state.startTime} 
										mode="time" 
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{
												fontFamily: 'OpenSans-Regular',
												color:!this.state.endTimeValidated ? '#ff0000' : gray
											}
										}}
										format="h:mm A" 
										confirmBtnText="Confirm" 
										cancelBtnText="Cancel" 
										is24Hour={false}
										onDateChange={(startTime) => {
											this.setState({endTimeValidated: true, startTime, endTime: this.beforeStartTime(startTime, undefined)});
											this.setState({disabledEndTime: this.enableEndTime()});
										}} />
								</View>

								<View>
									<View style={styles.time}>
										<Text style={styles.blueTitle}>End Time</Text>
										<DatePicker showIcon={false} 
											date={this.state.endTime} 
											mode="time" 
											disabled= {this.state.disabledEndTime}
											customStyles={{
												disabled:{backgroundColor: 'transparent'}, 
												dateInput:{borderWidth: 0}, 
												dateText:{fontFamily: 'OpenSans-Regular',
													color: !this.state.endTimeValidated ? '#ff0000' : gray,
													textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}, 
											}}
											format="h:mm A" 
											minDate={this.state.minEndTime}
											confirmBtnText="Confirm" 
											cancelBtnText="Cancel" 
											is24Hour={false}
											onDateChange={(endTime) => this.setState({endTime, startTime: this.beforeStartTime(undefined, endTime)})}/>
									</View>

									{errorEndTime}
								</View>
							</View>

							<View style={styles.textInput}>
								<MaterialIcons name="location-on"
									size={30}
									color={blue} />
								<View style={styles.textInputBorder}>
									<TextInput style={styles.textInputText} 
										onFocus={() => this.scrollToInput(this.refs.locationInput, 230)}
										maxLength={1024}
										placeholder="Location" 
										ref='locationInput'
										returnKeyType = {'done'}
										onChangeText={(location) => this.setState({location})} 
										value={this.state.location}/>
								</View>
							</View>

							<BottomButtons twoButtons={showNextButton}
								buttonText={[addEventButtonText, 'Done']}
								buttonMethods={[addEventButtonFunction, () => {
									let routes = this.props.navigation.dangerouslyGetParent().state.routes;

									if (routes && (routes[routes.length - 3].routeName == ReviewEventRoute || 
										(routes[routes.length - 3].routeName == SchoolInformationRoute && routes[routes.length - 4].routeName == ReviewEventRoute))) {
										this.props.navigation.navigate(ReviewEventRoute);
									} else if (routes && routes[routes.length - 2].routeName == SchoolScheduleRoute) {
										this.props.navigation.navigate(DashboardNavigator);
									} else {
										this.props.navigation.pop();
									}
								}]} />
						</View>
					</ScrollView>

				</KeyboardAvoidingView>
				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => this.setState({ snackbarVisible: false })} 
					style={styles.snackbar}
					duration={snackbarTime}>
					{snackbarText}
				</Snackbar>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { CoursesReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		CourseState: CoursesReducer[selected],
		CoursesReducer,
		selectedIndex: selected
	};
};

export default connect(mapStateToProps, null)(Course);