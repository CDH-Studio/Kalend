import React from 'react';
import { StatusBar, View, Text, Platform, TextInput, Switch, Picker, ActionSheetIOS, Dimensions, KeyboardAvoidingView, ScrollView, findNodeHandle } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { updateFixedEvents, addFixedEvent } from '../../actions';
import BottomButtons from '../BottomButtons';
import { FixedEventRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { fixedEventStyles as styles, blue, dark_blue, gray, statusBlueColor, white } from '../../styles';
import { getStrings } from '../../services/helper';

const moment = require('moment');

const viewHeight = 515.1428833007812;
const containerWidth = Dimensions.get('window').width;

/**
 * Permits the user to add their fixed events such as meetings and appointments.
 */
class FixedEvent extends React.PureComponent {

	strings = getStrings().FixedEvent;
	buttonStrings = getStrings().BottomButtons;

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.routeName === FixedEventRoute ? getStrings().FixedEvent.addTitle : getStrings().FixedEvent.editTitle,
		headerStyle: {
			backgroundColor: white
		}
	});

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		this.state = {
			containerHeight,

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

			startTime: moment().format('h:mm A'),
			disabledStartTime : false,

			endTime: moment().format('h:mm A'),
			minEndTime: moment().format('h:mm A'),
			disabledEndTime : true,
			endTimeValidated: true,

			location: '',
			recurrenceValue: this.strings.recurrence[0],
			recurrence: 'NONE',
			description: '',

			showTutShadow: true,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
		};
		updateNavigation('FixedEvent', props.navigation.state.routeName);
	}

	componentWillMount() {
		if(this.props.navigation.state.routeName === FixedEventRoute) {
			this.resetField();
		} else {
			this.setState({...this.props.FEditState});
		}
		this.setContainerHeight();
	}

	setContainerHeight = () => {
		let statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT - statusBarHeight;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		// Causes a bug (cannot scroll when keyboard is shown)
		// let scrollable = containerHeight !== containerHeightTemp;
		let showTutShadow = containerHeight !== containerHeightTemp;

		this.setState({
			containerHeight,
			showTutShadow
		});
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
			endTime = this.beforeStartTime(startTime, undefined);
		} else {
			endTime = this.state.endTime;
		}

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
			startTime = this.beforeStartTime(undefined, endTime);
		} else {
			startTime = this.state.startTime;
		} 

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
			endDate: (this.state.disabledEndDate || new Date(startDate) > new Date(this.state.endDate)) ? startDate : this.state.endDate,
			endDateValidated: true
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
			disabledEndTime: false,
			endTimeValidated: true
		});
	}

	/**
	 * Opens up the iOS action sheet to set the recurrence
	 */
	recurrenceOnClick = () => {
		return ActionSheetIOS.showActionSheetWithOptions(
			{
				options: [...this.strings.recurrence, this.strings.cancel],
				cancelButtonIndex: 4,
				tintColor: blue
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this.setState({recurrenceValue: 'NONE'});
				} else if (buttonIndex === 1) {
					this.setState({recurrenceValue: 'DAILY'});
				} else if (buttonIndex === 2) {
					this.setState({recurrenceValue: 'WEEKLY'});
				} else if (buttonIndex === 3) {
					this.setState({recurrenceValue: 'MONTHLY'});
				}
			},
		);
	}


	/**
	 * To go to the next screen without entering any information
	 */
	skip = () => {
		this.props.navigation.pop();
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

		if (this.props.navigation.state.routeName !== FixedEventRoute) {
			this.props.dispatch(updateFixedEvents(this.props.selectedIndex, this.state));
		} else {
			this.props.dispatch(addFixedEvent(this.state));
		}

		this.props.navigation.pop();
	}

	/**
	 * Adds the event to the calendar and resets the fields
	 */
	addAnotherEvent = () => {
		if (!this.fieldValidation()) {
			this.setState({
				snackbarText: this.strings.snackbarFailure,
				snackbarVisible: true,
				snackbarTime: 5000
			});
			return false;
		}

		this.props.dispatch(addFixedEvent(this.state));
		this.setState(this.resetField());
		this.refs._scrollView.scrollTo({x: 0});
		this.setState({
			snackbarText: this.strings.snackbarSuccess,
			snackbarVisible: true,
			snackbarTime: 3000
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

			startTime: moment().format('h:mm A'),
			disabledStartTime : false,

			endTime: moment().format('h:mm A'),
			minEndTime: moment().format('h:mm A'),
			disabledEndTime : true,
			endTimeValidated: true,

			location: '',
			recurrenceValue: this.strings.recurrence[0],
			recurrence: 'NONE',
			description: '',

			showTutShadow: true,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
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
		const { containerHeight, snackbarVisible, snackbarText, snackbarTime } = this.state;
		
		let addEventButtonText;
		let addEventButtonFunction;
		let errorTitle;
		let errorEnd;
		let showNextButton = true;

		if (!this.state.titleValidated) {
			errorTitle = <Text style={styles.errorTitle}>{this.strings.titleEmpty}</Text>;
		} else {
			errorTitle = null;
		}

		if(this.state.allDay === false) {
			if (!this.state.endDateValidated && !this.state.endTimeValidated) {
				errorEnd = <Text style={styles.errorEnd}>{this.strings.datesTimesEmpty}</Text>;
			} else if (!this.state.endTimeValidated) {
				errorEnd = <Text style={styles.errorEnd}>{this.strings.timesEmpty}</Text>;
			} else {
				errorEnd = null;
			}
		} else {
			if (!this.state.endDateValidated) {
				errorEnd = <Text style={styles.errorEnd}>{this.strings.alldayEmpty}</Text>;
			} else {
				errorEnd = null;
			}
		}

		/**
		 * In order to show components based on current route
		 */
		if (this.props.navigation.state.routeName === FixedEventRoute) {
			addEventButtonText = this.buttonStrings.add;
			addEventButtonFunction = this.addAnotherEvent;
		} else {
			addEventButtonText = this.buttonStrings.done;
			addEventButtonFunction = this.nextScreen;
			showNextButton = false;
		}
		
		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<KeyboardAvoidingView 
					behavior={Platform.OS === 'ios' ? 'padding' : null}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
					<ScrollView ref='_scrollView'
						scrollEventThrottle={100}>
						<View style={[styles.content, {height: containerHeight}]}>
							<View style={styles.instruction}>
								<Text style={styles.text}>{this.strings.description}</Text>
								
								<MaterialCommunityIcons name="calendar-today"
									size={130}
									color={dark_blue}/>
							</View>

							<View>
								<View style={styles.textInput}>
									<MaterialCommunityIcons name="format-title"
										size={30}
										color={blue} />

									<View style={[styles.textInputBorder, {borderBottomColor: !this.state.titleValidated ? '#ff0000' : '#D4D4D4'}]}>
										<TextInput style={styles.textInputText}
											maxLength={1024}
											placeholder={this.strings.titlePlaceholder}
											returnKeyType = {'next'}
											onSubmitEditing={() => this.refs.locationInput.focus()}
											blurOnSubmit={false}
											onChangeText={(title) => this.setState({title, titleValidated: true})}
											value={this.state.title}/>
									</View>
								</View>

								{errorTitle}
							</View>

							<View style={styles.timeSection}>
								<View style={[styles.allDay, {width: containerWidth}]}>
									<Text style={styles.blueTitle}>{this.strings.allday}</Text>
									<View style={styles.switch}>
										<Switch trackColor={{false: 'lightgray', true: blue}} 
											ios_backgroundColor={'lightgray'} 
											thumbColor={(this.state.allDay && Platform.OS !== 'ios') ? dark_blue : null} 
											onValueChange={(allDay) => this.setState({
												allDay: allDay, 
												disabledStartTime: !this.state.disabledStartTime,
												disabledEndTime: true,
												endTimeValidated: true})} 
											value = {this.state.allDay} />
									</View>
									<Text style={styles.empty}>empty</Text>
								</View>

								<View style={[styles.rowTimeSection, {width: containerWidth}]}>
									<Text style={styles.blueTitle}>{this.strings.start}</Text>
									<DatePicker showIcon={false} 
										date={this.state.startDate} 
										mode="date" 
										style={{width:140}}
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular',
												color: !this.state.endDateValidated ? '#ff0000' : gray}
										}}
										format="ddd., MMM DD, YYYY"
										minDate={this.state.minStartDate}
										maxDate={this.state.maxStartDate}
										confirmBtnText={this.strings.confirmButton}
										cancelBtnText={this.strings.cancelButton}
										onDateChange={this.startDateOnDateChange} />
										
									<DatePicker showIcon={false} 
										date={this.state.startTime} 
										mode="time"
										disabled={this.state.disabledStartTime}
										style={{width:70}}
										customStyles={{
											disabled:{backgroundColor: 'transparent'}, 
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular',
												color: gray,
												opacity: this.state.allDay ? 0 : 1} 
										}}
										format="h:mm A" 
										confirmBtnText={this.strings.confirmButton}
										cancelBtnText={this.strings.cancelButton}
										is24Hour={false}
										onDateChange={this.startTimeOnDateChange}/>
								</View>

								<View style={[styles.rowTimeSection, {width: containerWidth}]}>
									<Text style={styles.blueTitle}>{this.strings.end}</Text>
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
												color: !this.state.endDateValidated || !this.state.endTimeValidated ? '#ff0000' : gray,
												textDecorationLine: this.state.disabledEndDate ? 'line-through' : 'none'}}}
										format="ddd., MMM DD, YYYY" 
										minDate={this.state.minEndDate}
										confirmBtnText={this.strings.confirmButton}
										cancelBtnText={this.strings.cancelButton}
										onDateChange={this.endDateOnDateChange} />

									<DatePicker showIcon={false} 
										date={this.state.endTime} 
										mode="time" 
										disabled = {this.state.disabledEndTime}
										style={{width:70}}
										customStyles={{
											disabled:{backgroundColor: 'transparent'}, 
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular',
												opacity: this.state.allDay ? 0 : 1,
												color: !this.state.endTimeValidated ? '#ff0000' : gray,
												textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
										}}
										format="h:mm A" 
										minDate={this.state.minEndTime}
										confirmBtnText={this.strings.confirmButton}
										cancelBtnText={this.strings.cancelButton}
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
											onFocus={() => this.scrollToInput(this.refs.locationInput, 200)}
											maxLength={1024}
											placeholder={this.strings.locationPlaceholder} 
											ref='locationInput'
											returnKeyType = {'next'}
											onSubmitEditing={() =>  this.refs.descriptionInput.focus()}
											blurOnSubmit={false}
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
											maxLength={1024}
											onFocus={() => this.scrollToInput(this.refs.descriptionInput, 300)}
											placeholder={this.strings.descriptionPlaceholder} 
											ref='descriptionInput'
											returnKeyType = {'done'}
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
													<Picker.Item label={this.strings.recurrence[0]} value="NONE" />
													<Picker.Item label={this.strings.recurrence[1]} value="DAILY" />
													<Picker.Item label={this.strings.recurrence[2]} value="WEEKLY" />
													<Picker.Item label={this.strings.recurrence[3]} value="MONTHLY" />
												</Picker>
										}
									</View>
								</View>
							</View>

							<BottomButtons twoButtons={showNextButton}
								buttonText={[addEventButtonText, this.buttonStrings.done]}
								buttonMethods={[addEventButtonFunction, this.skip]} />
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
	const { FixedEventsReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		FEditState: FixedEventsReducer[selected],
		FixedEventsReducer,
		selectedIndex: NavigationReducer.reviewEventSelected
	};
};

export default connect(mapStateToProps, null)(FixedEvent);
