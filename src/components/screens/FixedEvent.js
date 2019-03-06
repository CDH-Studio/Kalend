import React from 'react';
import { StatusBar, View, Text, Platform, TouchableOpacity, TextInput, Switch, Picker, ActionSheetIOS, ScrollView, Dimensions } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { blueColor, orangeColor, lightOrangeColor, statusBlueColor, grayColor } from '../../../config';
import { ADD_FE, CLEAR_FE } from '../../constants';
import updateNavigation from '../NavigationHelper';
import { InsertFixedEvent } from '../../services/service';
import { fixedEventStyles as styles } from '../../styles';
import TutorialStatus, { HEIGHT } from '../TutorialStatus';

const viewHeight = 519.1428833007812;
const containerWidth = Dimensions.get('window').width;

/**
 * Permits the user to add their fixed events such as meetings and appointments. */
class FixedEvent extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.params.update ? 'Edit Fixed Event': 'Add Fixed Events',
		headerTintColor: '#ffffff',
		headerTitleStyle: {fontFamily: 'Raleway-Regular'},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: blueColor,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	});

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;
		
		this.state = { 
			containerHeight,

			title: '',
			
			allDay: false,

			startDate: new Date().toDateString(),
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),

			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,

			startTime: new Date().toLocaleTimeString(),
			disabledStartTime : false,
			amPmStart: this.getAmPm(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime : true,
			amPmEnd: this.getAmPm(),

			location: '',
			recurrenceValue: 'None',
			recurrence: 'NONE',
			description: '',

			eventID: ''
		};

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentWillMount() {
		if(this.props.navigation.state.routeName !== 'TutorialFixedEvent') {
			this.setState({...this.props.FEditState});
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
		console.log(startTime);
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
			amPmEnd: ''
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
			disabledEndTime: false
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
		this.props.navigation.navigate('TutorialNonFixedEvent', {update:false});
	}

	/**
	 * Adds the event in the calendar
	 */
	nextScreen = () => {
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

		if (this.props.navigation.state.routeName !== 'TutorialFixedEvent') {
			let events = this.props.FixedEventsReducer;
			let arr = [];

			events.map((event) => {
				if (event.eventID === this.state.eventID) {
					arr.push(this.state);
				} else {
					arr.push(event);
				}
			});

			this.props.dispatch({
				type: CLEAR_FE,
			});

			arr.map((event) => {
				this.props.dispatch({
					type: ADD_FE,
					event
				});
			});

			this.props.navigation.navigate('TutorialReviewEvent', {changed:true});
		} else {
			InsertFixedEvent(info).then(data => {
				if (!data.error) {
					this.setState({
						eventID: data.id
					});
					this.props.dispatch({
						type: ADD_FE,
						event: this.state
					});
					this.props.navigation.navigate('TutorialNonFixedEvent', {update:false});
				}
			});
		}
	}

	/**
	 * Adds the event to the calendar and resets the fields
	 */
	addAnotherEvent = () => {
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
				this.setState({
					eventID: data.id
				});
				this.props.dispatch({
					type: ADD_FE,
					event: this.state
				});
				this.resetField();
			}
		});
	}

	/**
	 * Reset the fields of the form
	 */
	resetField = () => {
		this.setState({
			title: '',

			allDay: false,

			startDate: new Date().toDateString(),
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),

			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,

			startTime: new Date().toLocaleTimeString(),
			disabledStartTime : false,
			amPmStart: this.getAmPm(),

			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime : true,
			amPmEnd: this.getAmPm(),

			location: '',
			recurrenceValue: 'None',
			recurrence: 'NONE',
			description: '',

			eventID: ''
		});
	}

	render() {
		const {containerHeight} = this.state;
		let tutorialStatus;
		let addEventButton;
		let nextButton;
		let paddingBottomContainer = HEIGHT;

		/**
		 * In order to show components based on current route
		 */
		if (this.props.navigation.state.routeName === 'TutorialFixedEvent') {
			tutorialStatus = <TutorialStatus active={2}
				color={blueColor}
				backgroundColor={'#ffffff'}
				skip={this.skip} />;

			addEventButton = 
				<TouchableOpacity style={styles.buttonEvent}
					onPress={this.addAnotherEvent}> 
					<Text style={styles.buttonEventText}>ADD ANOTHER{'\n'}EVENT</Text>
				</TouchableOpacity>;

			nextButton = 
			<TouchableOpacity style={styles.buttonNext}
				onPress={this.nextScreen}>
				<Text style={styles.buttonNextText}>NEXT</Text>
			</TouchableOpacity>;
		} else {
			tutorialStatus = null;

			addEventButton = null;

			nextButton = 
			<TouchableOpacity style={styles.buttonNext}
				onPress={this.nextScreen}>
				<Text style={styles.buttonNextText}>DONE</Text>
			</TouchableOpacity>;

			paddingBottomContainer = null;
		}
		
		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor} />

				<ScrollView style={styles.scrollView}>
					<View style={[styles.content, {height: containerHeight, paddingBottom:paddingBottomContainer}]}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add your events, office hours, appointments, etc.</Text>
							<MaterialCommunityIcons name="calendar-today"
								size={130}
								color={blueColor}/>
						</View>

						<View style={styles.textInput}>
							<MaterialCommunityIcons name="format-title"
								size={30}
								color={blueColor} />
							<View style={styles.textInputBorder}>
								<TextInput style={styles.textInputText}
									placeholder="Title" 
									onChangeText={(title) => this.setState({title})}
									value={this.state.title}/>
							</View>
						</View>
						<View style={styles.timeSection}>
							<View style={[styles.allDay, {width: containerWidth}]}>
								<Text style={styles.blueTitle}>All-Day</Text>
								<View style={styles.switch}>
									<Switch trackColor={{false: 'lightgray', true: lightOrangeColor}} 
										ios_backgroundColor={'lightgray'} 
										thumbColor={this.state.allDay ? orangeColor : 'darkgray'} 
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
										placeholderText:{color:grayColor}}} 
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
											color: grayColor, 
											textDecorationLine: this.state.disabledStartTime ? 'line-through' : 'none'}}}
									placeholder={this.getTwelveHourTime(this.state.startTime.split(':')[0] + ':' + this.state.startTime.split(':')[1] +  this.state.amPmStart)} 
									format="H:mm A" 
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
											color: grayColor, 
											textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}}}
									placeholder={this.getTwelveHourTime(this.state.endTime.split(':')[0] + ':' + this.state.endTime.split(':')[1] +  this.state.amPmEnd)} 
									format="H:mm A" 
									minDate={this.state.minEndTime}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									is24Hour={false}
									onDateChange={this.endTimeOnDateChange}/>
							</View>
						</View>

						<View style={styles.description}>
							<View style={styles.textInput}>
								<MaterialIcons name="location-on"
									size={30}
									color={blueColor} />

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
									color={blueColor} />

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
									color={blueColor} />

								<View style={styles.textInputBorder}>
									{
										Platform.OS === 'ios' ? 
											<Text onPress={this.recurrenceOnClick}>{this.state.recurrenceValue}</Text>
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

						<View style={styles.buttons}>
							{addEventButton}

							{nextButton}
						</View>
					</View>
				</ScrollView>

				{tutorialStatus}
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { FixedEventsReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		FEditState: FixedEventsReducer[selected],
		FixedEventsReducer
	};
}

export default connect(mapStateToProps, null)(FixedEvent);