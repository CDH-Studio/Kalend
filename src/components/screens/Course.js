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
import { getStartDate, timeVerification, getStrings } from '../../services/helper';
import { courseStyles as styles, statusBlueColor, dark_blue, blue, white } from '../../styles';

const moment = require('moment');
require('moment-round');

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

	strings = getStrings().Course;
	buttonStrings = getStrings().BottomButtons;

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.routeName === CourseRoute ? navigation.state.params.addTitle : navigation.state.params.editTitle,
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
			startTime: moment().round(30, 'minutes').format('h:mm A'),
			endTime: moment().round(30, 'minutes').format('h:mm A'),
			location: ''
		};

		updateNavigation('Course', props.navigation.state.routeName);
	}

	componentWillMount() {
		this.resetField();
		//In order to modify the courses taken from OCR
		//TODO: Convert to moment.js
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
		}	
	}

	//TODO: Remove if moment is applied in componentWillMount
	convertTimeWithSeconds = (time) => {
		let endTimeSplit = time.split(':');
		let endTimeSplitSpace = time.split(' ');

		time = endTimeSplit[0] + ':' + endTimeSplit[1] + ' ' + endTimeSplitSpace[1];
		return time;
	}

	/**
	 * Opens up the iOS action sheet to set the recurrence
	 */
	dayOfWeekOnClick = () => {
		return ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [...this.strings.week, this.strings.cancel],
				cancelButtonIndex: 7,
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this.setState({dayOfWeekValue: 'Monday'});
				} else if (buttonIndex === 1) {
					this.setState({dayOfWeekValue: 'Tuesday'});
				} else if (buttonIndex === 2) {
					this.setState({dayOfWeekValue: 'Wednesday'});
				} else if (buttonIndex === 3) {
					this.setState({dayOfWeekValue: 'Thursday'});
				} else if (buttonIndex === 4) {
					this.setState({dayOfWeekValue: 'Friday'});
				} else if (buttonIndex === 5) {
					this.setState({dayOfWeekValue: 'Saturday'});
				} else if (buttonIndex === 6) {
					this.setState({dayOfWeekValue: 'Sunday'});
				}
			},
		);
	}

	/**
	 * Validates the CourseCode field
	 */
	fieldValidation = () => {
		let validated = true;

		if (this.state.summary === '') {
			this.setState({courseCodeValidated: false});
			validated = false;
		} else {
			this.setState({courseCodeValidated: true});
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
				snackbarText: this.strings.snackbarFailure,
				snackbarVisible: true,
				snackbarTime: 5000
			});
			return false;
		}

		let courseStartDate = getStartDate(this.props.semesterStartDate, this.state.dayOfWeek);
		let courseEndDate = new Date(courseStartDate.getTime());

		courseEndDate = this.getDateFromTimeString(this.state.endTime, courseEndDate);
		courseEndDate = courseEndDate.toJSON();

		courseStartDate = this.getDateFromTimeString(this.state.startTime, courseStartDate);
		courseStartDate = courseStartDate.toJSON();

		return this.setState({
			end: {
				timeZone: 'America/Toronto',
				dateTime: courseEndDate
			},
			start: {
				timeZone: 'America/Toronto',
				dateTime: courseStartDate
			}
		}, () => {
			this.props.dispatch(addCourse(this.state));

			if (validated) {
				this.resetField();
				this.refs._scrollView.scrollTo({x: 0});
				this.setState({
					snackbarText: this.strings.snackbarSuccess,
					snackbarVisible: true,
					snackbarTime: 3000
				});
			}
			return validated;
		});
	}

	//TODO: Comment function
	getDateFromTimeString = (timeString, currentDate) => {
		let currentMoment = new moment(currentDate);
		let timeMoment = new moment(timeString, 'h:mm A');

		currentMoment.hours(timeMoment.hours());
		currentMoment.minutes(timeMoment.minutes());

		return currentMoment;
	}

	/**
	 * Reset the fields of the form
	 */
	resetField = () => {
		this.setState({
			summary: '',
			courseCodeValidated: true,
			dayOfWeek: this.strings.week[0],
			dayOfWeekValue: 'Monday',
			startTime: moment().round(30, 'minutes').format('h:mm A'),
			endTime: moment().round(30, 'minutes').format('h:mm A'),
			location: '',
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000,
			recurrence: [`RRULE:FREQ=WEEKLY;UNTIL=${this.props.semesterEndDate};`]
		});
	}

	//TODO: Comment function
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
		let showNextButton = true;

		if (!this.state.courseCodeValidated) {
			errorCourseCode = <Text style={styles.errorCourseCode}>{this.strings.courseCodeEmpty}</Text>;
		} else {
			errorCourseCode = null;
		}
		
		if (this.props.navigation.state.routeName === CourseRoute) {
			addEventButtonText = this.buttonStrings.add;
			addEventButtonFunction = this.addAnotherEvent;
		} else {
			addEventButtonText = this.buttonStrings.done;
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
								<Text style={styles.text}>{this.strings.description}</Text>
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
											placeholder={this.strings.courseCodePlaceholder}
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
								<Text style={styles.dayOfWeekTitle}>{this.strings.dayOfWeek}</Text>

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
												<Picker.Item label={this.strings.week[0]} value="Monday" />
												<Picker.Item label={this.strings.week[1]} value="Tuesday" />
												<Picker.Item label={this.strings.week[2]} value="Wednesday" />
												<Picker.Item label={this.strings.week[3]} value="Thursday" />
												<Picker.Item label={this.strings.week[4]} value="Friday" />
												<Picker.Item label={this.strings.week[5]} value="Saturday" />
												<Picker.Item label={this.strings.week[6]} value="Sunday" />
											</Picker>
									}
								</View>
							</View>
							<View>
								<View style={styles.time}>
									<Text style={styles.blueTitle}>{this.strings.startTime}</Text>
									<DatePicker showIcon={false} 
										date={this.state.startTime} 
										mode="time" 
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular'}
										}}
										format="h:mm A" 
										confirmBtnText={this.strings.confirmButton}
										cancelBtnText={this.strings.cancelButton}
										locale={'US'}
										is24Hour={false}
										onDateChange={(startTime) => {
											this.setState({startTime,
												endTime: timeVerification(startTime, this.state.endTime, this.state.endTime)});
										}} />
								</View>

								<View style={styles.time}>
									<Text style={styles.blueTitle}>{this.strings.endTime}</Text>
									<DatePicker showIcon={false} 
										date={this.state.endTime} 
										mode="time"
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular'}, 
										}}
										format="h:mm A"
										confirmBtnText={this.strings.confirmButton}
										cancelBtnText={this.strings.cancelButton}
										locale={'US'}
										is24Hour={false}
										onDateChange={(endTime) => {
											this.setState({endTime,
												startTime: timeVerification(this.state.startTime, endTime, this.state.startTime)});
										}} />
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
										placeholder={this.strings.locationPlaceholder}
										ref='locationInput'
										returnKeyType = {'done'}
										onChangeText={(location) => this.setState({location})} 
										value={this.state.location}/>
								</View>
							</View>

							<BottomButtons twoButtons={showNextButton}
								buttonText={[addEventButtonText, this.buttonStrings.done]}
								buttonMethods={[addEventButtonFunction, () => {
									let routes = this.props.navigation.dangerouslyGetParent().state.routes;

									if (routes && (routes[routes.length - 3].routeName == ReviewEventRoute || 
										(routes[routes.length - 3].routeName == SchoolInformationRoute && routes[routes.length - 4].routeName == ReviewEventRoute))) {
										this.props.navigation.navigate(ReviewEventRoute,  {title: getStrings().ReviewEvent.title});
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
	const { CoursesReducer, NavigationReducer, SchoolInformationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;
	let semesterEndDate = new Date(SchoolInformationReducer.info.info.endDate);
	let semesterStartDate = new Date(SchoolInformationReducer.info.info.startDate);
	semesterEndDate  = semesterEndDate.toISOString().split('T')[0].replace(/-/g, '');

	return {
		CourseState: CoursesReducer[selected],
		CoursesReducer,
		selectedIndex: selected,
		semesterEndDate,
		semesterStartDate
	};
};

export default connect(mapStateToProps, null)(Course);