import React from 'react';
import { Platform, Dimensions, ScrollView, StatusBar, Text, View, Switch, Button } from 'react-native';
import DatePicker from 'react-native-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-navigation';
import updateNavigation from '../NavigationHelper';
import { TutorialUnavailableHours, TutorialUnavailableFixed, TutorialReviewEvent, DashboardUnavailableFixed } from '../../constants/screenNames';
import { connect } from 'react-redux';
import { unavailableHoursStyles as styles, white, blue, gray, lightOrange, orange, statusBlueColor } from '../../styles';

/**
 * Permits the user to input the hours they are not available or don't want to have anything booked
 */
class UnavailableHours extends React.Component {

	static navigationOptions = ({navigation}) => ({
		title: 'Add Unavailable Hours',
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

		// let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		// let containerHeight = null;
		
		// if (viewHeight < containerHeightTemp) {
		// 	containerHeight = containerHeightTemp;
		// }

		this.state = { 
			// containerHeight,
			eventID: Date.now(),

			initialAmPm: this.getAmPm(),

			sleepWeek: false,
			startSleepWeek: new Date().toLocaleTimeString(),
			endSleepWeek: new Date().toLocaleTimeString(),
			sleepWeekEnd: false,
			startSleepWeekEnd: new Date().toLocaleTimeString(),
			endSleepWeekEnd: new Date().toLocaleTimeString(),

			commutingWeek: false,
			startCommutingWeek: new Date().toLocaleTimeString(),
			startCommutingWeekEnd: new Date().toLocaleTimeString(),
			commutingWeekEnd: false,
			endCommutingWeek: new Date().toLocaleTimeString(),
			endCommutingWeekEnd: new Date().toLocaleTimeString(),

			eatingWeek: false,
			startEatingWeek: new Date().toLocaleTimeString(),
			startEatingWeekEnd: new Date().toLocaleTimeString(),
			eatingWeekEnd: false,
			endEatingWeek: new Date().toLocaleTimeString(),
			endEatingWeekEnd: new Date().toLocaleTimeString(),

			otherWeek: false,
			startOtherWeek: new Date().toLocaleTimeString(),
			startOtherWeekEnd: new Date().toLocaleTimeString(),
			otherWeekEnd: false,
			endOtherWeek: new Date().toLocaleTimeString(),
			endOtherWeekEnd: new Date().toLocaleTimeString(),
		};
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
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
	 * Sets the minimum endTime on iOS devices
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
	 * To go to the appropriate Fixed Event screen according to the current route*/
	manualImport() {
		if (this.props.navigation.state.routeName === TutorialUnavailableHours) {
			this.props.navigation.navigate(TutorialUnavailableFixed, {update:false});
		} else {
			this.props.navigation.navigate(DashboardUnavailableFixed, {update:false});
		}
	}


	/**
	 * To go to the next screen without entering any information
	 */
	skip = () => {
		this.props.navigation.navigate(TutorialReviewEvent);
	}
	
	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor} />

				<ScrollView style={styles.scrollView}>
					<View style={styles.content}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add the hours for which you're not available or you don't want anything to be booked.</Text>
							<MaterialCommunityIcons name="block-helper"
								size={130}
								color={blue}/>
						</View>

						<View>
							<View style={styles.row}>
								<MaterialCommunityIcons name="sleep"
									size={30}
									color={blue}/>

								<Text style={styles.blueTitle}>Sleeping Hours</Text>
							</View>
							<View>
								<View style={styles.rowContent}>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.sleepWeek ? orange : 'darkgray'}
												onValueChange={(sleepWeek) => this.setState({sleepWeek: sleepWeek})}
												value = {this.state.sleepWeek} />
										</View>
										{this.state.sleepWeek ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startSleepWeek} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endSleepWeekValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startSleepWeek.split(':')[0] + ':' + this.state.startSleepWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startSleepWeek) => {
														this.setState({endSleepWeekValidated: true, startSleepWeek, endSleepWeek: this.beforeStartTime(this.getTwelveHourTime(startSleepWeek))});
														this.setState({ disabledEndSleepWeek: this.enableEndTime()});
													}}/>

												<Text> - </Text>

												<DatePicker showIcon={false} 
													date={this.state.endSleepWeek} 
													mode="time" 
													style={{width:70}}
													disabled= {this.state.disabledEndTime}
													customStyles={{
														disabled:{backgroundColor: 'transparent'}, 
														dateInput:{borderWidth: 0}, 
														dateText:{fontFamily: 'OpenSans-Regular'}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endSleepWeek.split(':')[0] + ':' + this.state.endSleepWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													minDate={this.state.minEndTime}
													is24Hour={false}
													onDateChange={(endSleepWeek) => this.setState({endSleepWeek, startSleepWeek: this.beforeStartTime(undefined, this.getTwelveHourTime(endSleepWeek))})}/>
											</View> : null}
									</View>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week-End</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.sleepWeekEnd ? orange : 'darkgray'}
												onValueChange={(sleepWeekEnd) => this.setState({sleepWeekEnd: sleepWeekEnd})}
												value = {this.state.sleepWeekEnd} />
										</View>

										{this.state.sleepWeekEnd ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startSleepWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startSleepWeekEnd.split(':')[0] + ':' + this.state.startSleepWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startSleepWeekEnd) => {
														this.setState({endTimeValidated: true, startSleepWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(startSleepWeekEnd))});
														this.setState({ disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endSleepWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endSleepWeekEnd.split(':')[0] + ':' + this.state.endSleepWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endSleepWeekEnd) => {
														this.setState({endTimeValidated: true, endSleepWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(endSleepWeekEnd))});
														this.setState({ disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
										
									</View>
								</View>
							</View>
						</View>




						<View>
							<View style={styles.row}>
								<MaterialCommunityIcons name="train-car"
									size={30}
									color={blue}/>

								<Text style={styles.blueTitle}>Commuting Hours</Text>
							</View>

							<View>
								<View style={styles.rowContent}>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.commutingWeek ? orange : 'darkgray'}
												onValueChange={(commutingWeek) => this.setState({commutingWeek: commutingWeek})}
												value = {this.state.commutingWeek} />
										</View>

										{this.state.commutingWeek ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startCommutingWeek} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startCommutingWeek.split(':')[0] + ':' + this.state.startCommutingWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startCommutingWeek) => {
														this.setState({endTimeValidated: true, startCommutingWeek, endTime: this.beforeStartTime(this.getTwelveHourTime(startCommutingWeek))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endCommutingWeek} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endCommutingWeek.split(':')[0] + ':' + this.state.endCommutingWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endCommutingWeek) => {
														this.setState({endTimeValidated: true, endCommutingWeek, endTime: this.beforeStartTime(this.getTwelveHourTime(endCommutingWeek))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
									
									</View>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week-End</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.commutingWeekEnd ? orange : 'darkgray'}
												onValueChange={(commutingWeekEnd) => this.setState({commutingWeekEnd: commutingWeekEnd})}
												value = {this.state.commutingWeekEnd} />
										</View>

										{this.state.commutingWeekEnd ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startCommutingWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startCommutingWeekEnd.split(':')[0] + ':' + this.state.startCommutingWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startCommutingWeekEnd) => {
														this.setState({endTimeValidated: true, startCommutingWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(startCommutingWeekEnd))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endCommutingWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endCommutingWeekEnd.split(':')[0] + ':' + this.state.endCommutingWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endCommutingWeekEnd) => {
														this.setState({endTimeValidated: true, endCommutingWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(endCommutingWeekEnd))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
									</View>

								</View>

								
							</View>
						</View>



						<View>
							<View style={styles.row}>
								<MaterialCommunityIcons name="food"
									size={30}
									color={blue}/>

								<Text style={styles.blueTitle}>Eating Hours</Text>
							</View>

							<View>
								<View style={styles.rowContent}>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.eatingWeek ? orange : 'darkgray'}
												onValueChange={(eatingWeek) => this.setState({eatingWeek: eatingWeek})}
												value = {this.state.eatingWeek} />
										</View>

										{this.state.eatingWeek ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startEatingWeek} 
													mode="time"
													style={{width:70}} 
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startEatingWeek.split(':')[0] + ':' + this.state.startEatingWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startEatingWeek) => {
														this.setState({endTimeValidated: true, startEatingWeek, endTime: this.beforeStartTime(this.getTwelveHourTime(startEatingWeek))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endEatingWeek} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endEatingWeek.split(':')[0] + ':' + this.state.endEatingWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endEatingWeek) => {
														this.setState({endTimeValidated: true, endEatingWeek, endTime: this.beforeStartTime(this.getTwelveHourTime(endEatingWeek))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
									
									</View>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week-End</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.eatingWeekEnd ? orange : 'darkgray'}
												onValueChange={(eatingWeekEnd) => this.setState({eatingWeekEnd: eatingWeekEnd})}
												value = {this.state.eatingWeekEnd} />
										</View>

										{this.state.eatingWeekEnd ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startEatingWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startEatingWeekEnd.split(':')[0] + ':' + this.state.startEatingWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startEatingWeekEnd) => {
														this.setState({endTimeValidated: true, startEatingWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(startEatingWeekEnd))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endEatingWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endEatingWeekEnd.split(':')[0] + ':' + this.state.endEatingWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endEatingWeekEnd) => {
														this.setState({endTimeValidated: true, endEatingWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(endEatingWeekEnd))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
									</View>

								</View>

								
							</View>
						</View>

						<View>
							<View style={styles.row}>
								<MaterialCommunityIcons name="timelapse"
									size={30}
									color={blue}/>

								<Text style={styles.blueTitle}>Other Unavailable Hours</Text>
							</View>

							<View>
								<View style={styles.rowContent}>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.otherWeek ? orange : 'darkgray'}
												onValueChange={(otherWeek) => this.setState({otherWeek: otherWeek})}
												value = {this.state.otherWeek} />
										</View>

										{this.state.otherWeek ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startOtherWeek} 
													mode="time"
													style={{width:70}} 
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startOtherWeek.split(':')[0] + ':' + this.state.startOtherWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startOtherWeek) => {
														this.setState({endTimeValidated: true, startOtherWeek, endTime: this.beforeStartTime(this.getTwelveHourTime(startOtherWeek))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endOtherWeek} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endOtherWeek.split(':')[0] + ':' + this.state.endOtherWeek.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endOtherWeek) => {
														this.setState({endTimeValidated: true, endOtherWeek, endTime: this.beforeStartTime(this.getTwelveHourTime(endOtherWeek))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
									
									</View>
									<View style={styles.colContent}>
										<View style={styles.row}>
											<Text style={styles.type}>Week-End</Text>

											<Switch trackColor={{false: 'lightgray', true: lightOrange}}
												ios_backgroundColor={'lightgray'}
												thumbColor={this.state.otherWeekEnd ? orange : 'darkgray'}
												onValueChange={(otherWeekEnd) => this.setState({otherWeekEnd: otherWeekEnd})}
												value = {this.state.otherWeekEnd} />
										</View>

										{this.state.otherWeekEnd ?
											<View style={styles.row}>
												<DatePicker showIcon={false} 
													date={this.state.startOtherWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0}, 
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{color: !this.state.endTimeValidated ? '#ff0000' : gray}
													}}
													placeholder={this.getTwelveHourTime(this.state.startOtherWeekEnd.split(':')[0] + ':' + this.state.startOtherWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(startOtherWeekEnd) => {
														this.setState({endTimeValidated: true, startOtherWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(startOtherWeekEnd))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>

												<Text> - </Text>
													
												<DatePicker showIcon={false} 
													date={this.state.endOtherWeekEnd} 
													mode="time" 
													style={{width:70}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular',
															color: gray
														}, 
														placeholderText:{
															color: !this.state.endTimeValidated ? '#ff0000' : gray,
															textDecorationLine: this.state.disabledEndTime ? 'line-through' : 'none'}
													}}
													placeholder={this.getTwelveHourTime(this.state.endOtherWeekEnd.split(':')[0] + ':' + this.state.endOtherWeekEnd.split(':')[1] +  this.state.initialAmPm)} 
													format="h:mm A" 
													confirmBtnText="Confirm" 
													cancelBtnText="Cancel" 
													is24Hour={false}
													onDateChange={(endOtherWeekEnd) => {
														this.setState({endTimeValidated: true, endOtherWeekEnd, endTime: this.beforeStartTime(this.getTwelveHourTime(endOtherWeekEnd))});
														this.setState({disabledEndTime: this.enableEndTime()});
													}}/>
											</View> : null}
									</View>
								</View>
							</View>
						</View>

						<Text style={styles.manual}>
							<Text style={styles.textManual}>Want to add more specific unavailable hours? Add them as </Text>
							<Text style={styles.buttonManual} onPress={() => this.manualImport()}>Fixed Events</Text>
							<Text style={styles.textManual}>!</Text>
						</Text>
						
						<View>
							<Button title={'NEXT'} />
						</View>

					</View>
				</ScrollView>
			</View>
		);
	}
}

export default UnavailableHours;