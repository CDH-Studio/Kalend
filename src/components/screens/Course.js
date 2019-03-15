import React from 'react';
import { Platform, Dimensions, StatusBar, Text, View, ScrollView, TextInput, Picker, ActionSheetIOS } from 'react-native';
import DatePicker from 'react-native-datepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { updateCourses, addCourse } from '../../actions';
import BottomButtons from '../BottomButtons';
import { CourseRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { courseStyles as styles, statusBlueColor, gray, dark_blue, blue, white } from '../../styles';

const viewHeight = 774.8571166992188;
const containerHeight = Dimensions.get('window').height - Header.HEIGHT;

/**
 * Permits the user to input their school schedule manually 
 * or to edit the previously entred courses
 */
class Course extends React.Component {

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

			courseCode: '',

			dayOfWeek: 'Monday',
			dayOfWeekValue: 'Monday',

			startTime: new Date().toLocaleTimeString(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime: true,

			location: ''
		};

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		if (this.props.navigation.state.routeName === CourseRoute) {
			this.resetField();
		} else {
			this.setState({...this.props.CourseState});
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

		if (this.state.courseCode === '') {
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
	}

	/**
	 * Reset the fields of the form
	 */
	resetField = () => {
		this.setState({
			courseCode: '',
			courseCodeValidated: true,
			
			dayOfWeek: 'Monday',
			dayOfWeekValue: 'Monday',

			startTime: new Date().toLocaleTimeString(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime: true,
			endTimeValidated: true,

			location: '',
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
		});
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
					backgroundColor={statusBlueColor} />

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
										placeholder="Course Code" 
										onChangeText={(courseCode) => this.setState({courseCode, courseCodeValidated: true})} 
										value={this.state.courseCode} />
								</View>
							</View>

							{errorCourseCode}
						</View>

						<View style={styles.dayOfWeekSection}>
							<Text style={styles.dayOfWeekTitle}>Day of Week</Text>

							<View style={styles.dayOfWeekBorder}>
								{
									Platform.OS === 'ios' ? 
										<Text onPress={this.dayOfWeekOnClick}>{dayOfWeekValue.charAt(0).toUpperCase() + dayOfWeekValue.slice(1).toLowerCase()}</Text>
										:	
										<Picker style={styles.dayOfWeekValues} 
											selectedValue={this.state.dayOfWeek} 
											onValueChange={(dayOfWeekValue) => this.setState({dayOfWeek: dayOfWeekValue})}>
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
									placeholder="Location" 
									onChangeText={(location) => this.setState({location})} 
									value={this.state.location}/>
							</View>
						</View>


						<BottomButtons twoButtons={showNextButton}
							buttonText={[addEventButtonText, 'Done']}
							buttonMethods={[addEventButtonFunction, () => 
								this.props.navigation.pop()]} />
					</View>
				</ScrollView>

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