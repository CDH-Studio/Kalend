import React from 'react';
import { StatusBar, View, Text, Platform, TouchableOpacity, TextInput, Switch, Picker, ActionSheetIOS, ScrollView, Dimensions } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Snackbar } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import updateNavigation from '../NavigationHelper';
import { InsertFixedEvent } from '../../services/service';
import { fixedEventStyles as styles, white, blue, orange, lightOrange, gray, statusBlueColor } from '../../styles';
import TutorialStatus, { onScroll } from '../TutorialStatus';
import { TutorialFixedEvent, TutorialNonFixedEvent, TutorialReviewEvent, DashboardAddCourse } from '../../constants/screenNames';
import { updateFixedEvents, addFixedEvent } from '../../actions';
import BottomButtons from '../BottomButtons';

const viewHeight = 446.66668701171875;
const containerWidth = Dimensions.get('window').width;

/**
 * Permits the user to add their fixed events such as meetings and appointments. */
class FixedEvent extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.routeName === TutorialFixedEvent || navigation.state.routeName === DashboardAddCourse ? 'Add Fixed Events' : 'Edit Fixed Event',
		headerTintColor: white,
		headerTitleStyle: {fontFamily: 'Raleway-Regular'},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: blue,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	});

	constructor(props) {
		super(props);
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		if(this.props.navigation.state.routeName !== TutorialFixedEvent) {
			this.setState({...this.props.FEditState});
		} else {
			this.resetField();
		}

		this.setContainerHeight();
	}

	setContainerHeight = () => {
		let statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
		let tutorialStatusHeight = this.props.navigation.state.routeName === TutorialFixedEvent ? 56.1 : 0;
		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT - tutorialStatusHeight - statusBarHeight;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		// Causes a bug (cannot scroll when keyboard is shown)
		// let scrollable = containerHeight !== containerHeightTemp;
		let scrollable = true;
		let showTutShadow = containerHeight !== containerHeightTemp;

		this.setState({
			scrollable,
			containerHeight,
			showTutShadow
		});
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

		if (currentHour > 12) {
			currentHour = currentHour % 12;
			time.setHours(currentHour);
		}

		if (currentMinute < 10) {
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

	/**
	 * Sets the min end time on iOS
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
	beforeStartTime(startTime, endTime) {
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
	 * The onDateChange of the start time dialog which modifies the appropriate state variables
	 * 
	 * @param {String} startTime The time output of the time dialog
	 */
	startTimeOnDateChange = (startTime) => {
		let firstDate = new Date(this.state.startDate).getTime();
		let endDate = new Date(this.state.endDate).getTime();

		let endTime;
		if (this.state.disabledEndTime) {
			endTime = startTime;
		} else if (firstDate === endDate) {
			endTime = this.beforeStartTime(this.getTwelveHourTime(startTime));
		} else {
			endTime = this.state.endTime;
		}

		startTime = this.getTwelveHourTime(startTime);

		this.setState({
			startTime, 
			endTime, 
			amPmStart: '', 
			amPmEnd: ''
		});
	} 

	/**
	 * The onDateChange of the end time dialog which modifies the appropriate state variables
	 * 
	 * @param {String} endTime The time output of the time dialog
	 */
	endTimeOnDateChange = (endTime) => {
		let firstDate = new Date(this.state.startDate).getTime();
		let endDate = new Date(this.state.endDate).getTime();

		let startTime;
		if (firstDate === endDate) {
			startTime = this.beforeStartTime(undefined, this.getTwelveHourTime(endTime));
		} else {
			startTime = this.state.startTime;
		} 

		endTime = this.getTwelveHourTime(endTime);
		this.setState({
			startTime,
			endTime, 
			amPmEnd: '',
			endTimeValidated: true
		});
	}

	/**
	 * The onDateChange of the start date dialog which modifies the appropriate state variables
	 * 
	 * @param {String} startDate The date output of the date dialog
	 */
	startDateOnDateChange = (startDate) => {
		if (this.state.startDate !== this.state.endDate && startDate === this.state.endDate) {
			this.setState({endTime: this.beforeStartTime(this.state.startTime)});
		}

		this.setState({
			startDate: startDate, 
			disabledEndDate: false, 
			minEndDate: startDate, 
			endDate: (this.state.disabledEndDate || new Date(startDate) > new Date(this.state.endDate)) ? startDate : this.state.endDate
		});
	}

	/**
	 * The onDateChange of the end date dialog which modifies the appropriate state variables
	 * 
	 * @param {String} endDate The date output of the date dialog
	 */
	endDateOnDateChange = (endDate) => { 
		if (this.state.startDate !== this.state.endDate && endDate === this.state.startDate) {
			this.setState({endTime: this.beforeStartTime(this.state.startTime)});
		}

		this.setState({
			endDate: endDate, 
			maxStartDate: endDate, 
			minEndTime: this.setMinEndTime(),
			disabledEndTime: false,
			endDateValidated: true
		});
	}

	/**
	 * Opens up the iOS action sheet to set the recurrence
	 */
	recurrenceOnClick = () => {
		return ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['None', 'Everyday', 'Weekly', 'Monthly', 'Cancel'],
				cancelButtonIndex: 4,
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this.state.recurrenceValue = 'NONE';
				} else if (buttonIndex === 1) {
					this.state.recurrenceValue = 'DAILY';
				} else if (buttonIndex === 2) {
					this.state.recurrenceValue = 'WEEKLY';
				} else if (buttonIndex === 3) {
					this.state.recurrenceValue = 'MONTHLY';
				}
				this.forceUpdate();
			},
		);
	}


	/**
	 * To go to the next screen without entering any information
	 */
	skip = () => {
		this.props.navigation.navigate(TutorialNonFixedEvent);
	}

	/**
	 * Validates the Title, End Date and End Time fields
	 */
	fieldValidation = () => {
		let validated = true;

		if (this.state.title === '') {
			this.setState({titleValidated: false});
			validated = false;
		} else {
			this.setState({titleValidated: true});
		}
		
		if (this.state.disabledEndDate === true) {
			this.setState({endDateValidated: false});
			validated = false;
		} else {
			this.setState({endDateValidated: true});
		}
		
		if(this.state.allDay === false) {
			if (this.state.disabledEndTime === true) {
				this.setState({endTimeValidated: false});
				validated = false;
			} else {
				this.setState({endTimeValidated: true});
			}
		}

		return validated;
	}

	/**
	 * Adds the event in the calendar
	 */
	nextScreen = () => {
		if (!this.fieldValidation()) {
			return;
		}

		if (this.props.navigation.state.routeName !== TutorialFixedEvent) {
			this.props.dispatch(updateFixedEvents(this.props.selectedIndex, this.state));
			this.props.navigation.navigate(TutorialReviewEvent);
		} else {
			let info = {
				title: this.state.title,
				location: this.state.location,
				description: this.state.description,
				recurrence: this.state.recurrence,
				allDay: this.state.allDay,
				startDate: this.state.startDate,
				startTime: this.state.startTime,
				endDate: this.state.endDate,
				endTime: this.state.endTime
			}; 

			InsertFixedEvent(info).then(data => {
				if (!data.error) {
					this.props.dispatch(addFixedEvent(this.state));
					this.props.navigation.navigate(TutorialNonFixedEvent);
				}
			});
		}
	}

	/**
	 * Adds the event to the calendar and resets the fields
	 */
	addAnotherEvent = () => {
		if (!this.fieldValidation()) {
			this.setState({
				snackbarText: 'Invalid fields, please review to add event',
				snackbarVisible: true,
				snackbarTime: 5000
			});
			return false;
		}

		let info = {
			title: this.state.title,
			location: this.state.location,
			description: this.state.description,
			recurrence: this.state.recurrence,
			allDay: this.state.allDay,
			startDate: this.state.startDate,
			startTime: this.state.startTime,
			endDate: this.state.endDate,
			endTime: this.state.endTime
		};
		InsertFixedEvent(info).then(data => {
			if (!data.error) {
				this.props.dispatch(addFixedEvent(this.state));
				this.resetField();
				this.setState({
					snackbarText: 'Event successfully added',
					snackbarVisible: true,
					snackbarTime: 3000
				});
			}
		});
	}

	/**
	 * Reset the fields of the form
	 */
	resetField = () => {
		this.setState({
			title: '',
			titleValidated: true,

			allDay: false,

			startDate: new Date().toDateString(),
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),

			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,
			endDateValidated: true,

			startTime: new Date().toLocaleTimeString(),
			disabledStartTime : false,
			amPmStart: this.getAmPm(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime : true,
			amPmEnd: this.getAmPm(),
			endTimeValidated: true,

			location: '',
			recurrenceValue: 'None',
			recurrence: 'NONE',
			description: '',

			showTutShadow: true,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
		});
	}

	render() {
		const { containerHeight, scrollable, showTutShadow, snackbarVisible, snackbarText, snackbarTime } = this.state;
		
		let tutorialStatus;
		let addEventButtonText;
		let addEventButtonFunction;
		let errorTitle;
		let errorEnd;
		let addEventButtonWidth;
		let showNextButton = true;

		if (!this.state.titleValidated) {
			errorTitle = <Text style={styles.errorTitle}>Title cannot be empty.</Text>;
		} else {
			errorTitle = null;
		}

		if(this.state.allDay === false) {
			if (!this.state.endDateValidated && !this.state.endTimeValidated) {
				errorEnd = <Text style={styles.errorEnd}>Please select Dates and Times.</Text>;
			} else if (!this.state.endTimeValidated) {
				errorEnd = <Text style={styles.errorEnd}>Please select an End Date and Time.</Text>;
			} else {
				errorEnd = null;
			}
		} else {
			if (!this.state.endDateValidated) {
				errorEnd = <Text style={styles.errorEnd}>Please select a Start and End Date.</Text>;
			} else {
				errorEnd = null;
			}
		}

		/**
		 * In order to show components based on current route
		 */
		if (this.props.navigation.state.routeName === TutorialFixedEvent) {
			tutorialStatus = <TutorialStatus active={2}
				color={blue}
				backgroundColor={'#ffffff'}
				skip={this.skip}
				showTutShadow={showTutShadow} />;

			addEventButtonText = 'Add';
			addEventButtonFunction = this.addAnotherEvent;
			addEventButtonWidth = '48%';
		} else {
			tutorialStatus = null;

			addEventButtonText = 'Done';
			addEventButtonFunction = this.nextScreen;
			addEventButtonWidth = '100%';
			showNextButton = false;
		}
		
		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor} />
				
				<ScrollView style={styles.scrollView}
					onScroll={(event) => this.setState({showTutShadow: onScroll(event, showTutShadow)})}
					scrollEnabled={scrollable}
					scrollEventThrottle={100}>
					<View style={[styles.content, {height: containerHeight}]}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add your events, office hours, appointments, etc.</Text>
							
							<MaterialCommunityIcons name="calendar-today"
								size={130}
								color={blue}/>
						</View>

						<View>
							<View style={styles.textInput}>
								<MaterialCommunityIcons name="format-title"
									size={30}
									color={blue} />

								<View style={[styles.textInputBorder, {borderBottomColor: !this.state.titleValidated ? '#ff0000' : '#D4D4D4'}]}>
									<TextInput style={styles.textInputText}
										placeholder="Title" 
										onChangeText={(title) => this.setState({title, titleValidated: true})}
										value={this.state.title}/>
								</View>
							</View>

							{errorTitle}
						</View>

						<View style={styles.timeSection}>
							<View style={[styles.allDay, {width: containerWidth}]}>
								<Text style={styles.blueTitle}>All-Day</Text>
								<View style={styles.switch}>
									<Switch trackColor={{false: 'lightgray', true: lightOrange}} 
										ios_backgroundColor={'lightgray'} 
										thumbColor={this.state.allDay ? orange : 'darkgray'} 
										onValueChange={(allDay) => this.setState({
											allDay: allDay, 
											disabledStartTime: !this.state.disabledStartTime, disabledEndTime: true})} 
										value = {this.state.allDay} />
								</View>
								<Text style={styles.empty}>empty</Text>
							</View>

							<View style={[styles.rowTimeSection, {width: containerWidth}]}>
								<Text style={styles.blueTitle}>Start</Text>
								<DatePicker showIcon={false} 
									date={this.state.startDate} 
									mode="date" 
									style={{width:140}}
									customStyles={{
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular'}, 
										placeholderText:{color:gray}}} 
									placeholder={this.state.startDate} 
									format="ddd., MMM DD, YYYY" 
									minDate={this.state.minStartDate} 
									maxDate={this.state.maxStartDate}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									onDateChange={this.startDateOnDateChange} />
									
								<DatePicker showIcon={false} 
									date={this.state.startTime} 
									mode="time"
									disabled={this.state.disabledStartTime}
									style={{width:80}}
									customStyles={{
										disabled:{backgroundColor: 'transparent'}, 
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular',
											textDecorationLine: this.state.disabledStartTime ? 'line-through' : 'none'}, 
										placeholderText:{
											color: gray, 
											opacity: this.state.disabledStartTime ? 0 : 1,
											textDecorationLine: this.state.disabledStartTime ? 'line-through' : 'none'}}}
									placeholder={this.getTwelveHourTime(this.state.startTime.split(':')[0] + ':' + this.state.startTime.split(':')[1] +  this.state.amPmStart)} 
									format="h:mm A" 
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									is24Hour={false}
									onDateChange={this.startTimeOnDateChange}/>
							</View>

							<View style={[styles.rowTimeSection, {width: containerWidth}]}>
								<Text style={styles.blueTitle}>End</Text>
								<DatePicker showIcon={false} 
									date={this.state.endDate} 
									mode="date" 
									style={{width:140}}
									disabled = {this.state.disabledEndDate}
									customStyles={{
										disabled:{backgroundColor: 'transparent'}, 
										dateInput:{borderWidth: 0}, 
										dateText:{
											fontFamily: 'OpenSans-Regular', 
											color: !this.state.endDateValidated ? '#ff0000' : gray,
											textDecorationLine: this.state.disabledEndDate ? 'line-through' : 'none'}}} 
									placeholder={this.state.endDate} 
									format="ddd., MMM DD, YYYY" 
									minDate={this.state.minEndDate}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									onDateChange={this.endDateOnDateChange} />

								<DatePicker showIcon={false} 
									date={this.state.endTime} 
									mode="time" 
									disabled = {this.state.disabledEndTime}
									style={{width:80}}
									customStyles={{
										disabled:{backgroundColor: 'transparent'}, 
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular',
											textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}, 
										placeholderText:{
											color: !this.state.endTimeValidated ? '#ff0000' : gray, 
											opacity: this.state.allDay ? 0 : 1,
											textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}}}
									placeholder={this.getTwelveHourTime(this.state.endTime.split(':')[0] + ':' + this.state.endTime.split(':')[1] +  this.state.amPmEnd)} 
									format="h:mm A" 
									minDate={this.state.minEndTime}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									is24Hour={false}
									onDateChange={this.endTimeOnDateChange}/>
							</View>

							{errorEnd}
						</View>

						<View style={styles.description}>
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

							<View style={styles.textInput}>
								<MaterialCommunityIcons name="text-short"
									size={30}
									color={blue} />

								<View style={styles.textInputBorder}>
									<TextInput style={styles.textInputText} 
										placeholder="Description" 
										onChangeText={(description) => this.setState({description})} 
										value={this.state.description}/>
								</View>
							</View>

							<View style={styles.textInput}>
								<Feather name="repeat"
									size={30}
									color={blue} />

								<View style={styles.textInputBorder}>
									{
										Platform.OS === 'ios' ? 
											<Text onPress={this.recurrenceOnClick}>{this.state.recurrenceValue.charAt(0).toUpperCase() + this.state.recurrenceValue.slice(1).toLowerCase()}</Text>
											:	
											<Picker style={styles.recurrence} 
												selectedValue={this.state.recurrence} 
												onValueChange={(recurrenceValue) => this.setState({recurrence: recurrenceValue})}>
												<Picker.Item label="None" value="NONE" />
												<Picker.Item label="Everyday" value="DAILY" />
												<Picker.Item label="Weekly" value="WEEKLY" />
												<Picker.Item label="Monthly" value="MONTHLY" />
											</Picker>
									}
								</View>
							</View>
						</View>

						<BottomButtons twoButtons={showNextButton}
							buttonText={[addEventButtonText, 'Next']}
							buttonMethods={[addEventButtonFunction, this.skip]} />
					</View>
				</ScrollView>

				{tutorialStatus}

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

function mapStateToProps(state) {
	const { FixedEventsReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		FEditState: FixedEventsReducer[selected],
		FixedEventsReducer,
		selectedIndex: NavigationReducer.reviewEventSelected
	};
}

export default connect(mapStateToProps, null)(FixedEvent);
