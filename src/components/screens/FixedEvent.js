import React from 'react';
import {StatusBar, StyleSheet, View, Text, Platform, TouchableOpacity, TextInput, Switch, Picker, ActionSheetIOS, ScrollView, Dimensions} from 'react-native';
import {Header} from 'react-navigation';
import { blueColor, orangeColor, lightOrangeColor, statusBlueColor } from '../../../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-datepicker';
import TutorialStatus, {HEIGHT} from '../TutorialStatus';

//TODO
//Add onPress={() => } for Add Another Event button - Removed for now to avoid missing function error
//Add onSubmit functions for buttons + navigate/resetForm

class FixedEvent extends React.Component {

	// Style for Navigation Bar
	static navigationOptions = {
		title: 'Add Fixed Events',
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
		this.state = { 
			//Height of Screen
			containerHeight: null,

			//Title of Event
			title: '',
			
			//Time section
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

			//Other Information
			location: '',
			recurrenceValue: 'None'
		};
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
		let firstDate = new Date(this.state.startDate).getTime();this.beforeStartTime(this.getTwelveHourTime(startTime));
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
			amPmEnd: ''
		});
	}

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
				console.log(buttonIndex);
				console.log(this.state);
				if (buttonIndex === 0) {
					this.state.recurrenceValue = 'None';
				} else if (buttonIndex === 1) {
					this.state.recurrenceValue = 'Everyday';
				} else if (buttonIndex === 2) {
					this.state.recurrenceValue = 'Weekly';
				} else if (buttonIndex === 3) {
					this.state.recurrenceValue = 'Monthly';
				}
				this.forceUpdate();
			},
		);
	}

	/**
	 * Goes to the next screen
	 */
	nextScreen = () => {
		this.props.navigation.navigate('NonFixedEvent');
	}

	//Render UI
	render() {
		const containerHeight = Dimensions.get('window').height - Header.HEIGHT;
		return (
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={statusBlueColor} />

				<ScrollView style={styles.content}>
					<View style={{height: this.state.containerHeight, flex:1, paddingBottom:HEIGHT, justifyContent:'space-evenly'}} 
						onLayout={(event) => {
							let {height} = event.nativeEvent.layout;
							console.log(height, 12);
							if(height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add your events, office hours, appointments, etc.</Text>
							<MaterialCommunityIcons name="calendar-today" size={130} color={blueColor}/>
						</View>

						<View style={styles.textInput}>
							<MaterialCommunityIcons name="format-title" size={30} color={blueColor} />
							<View style={styles.textInputBorder}>
								<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} 
									placeholder="Title" 
									onChangeText={(title) => this.setState({title})} 
									value={this.state.title}/>
							</View>
						</View>
						<View style={styles.timeSection}>
							<View style={styles.allDay}>
								<Text style={styles.blueTitle}>All-Day</Text>
								<View style={{width: 130, alignItems:'flex-start'}}>
									<Switch 
										trackColor={{false: 'lightgray', true: lightOrangeColor}} 
										ios_backgroundColor={'lightgray'} 
										thumbColor={this.state.allDay ? orangeColor : 'darkgray'} 
										onValueChange={(allDay) => this.setState({
											allDay: allDay, 
											disabledStartTime: !this.state.disabledStartTime, disabledEndTime: true})} 
										value = {this.state.allDay} />
								</View>
								<Text style={{width:65.8, opacity:0}}>empty</Text>
							</View>

							<View style={styles.rowTimeSection}>
								<Text style={styles.blueTitle}>Start</Text>
								<DatePicker showIcon={false} 
									date={this.state.startDate} 
									mode="date" 
									style={{width:140}}
									customStyles={{
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular'}, 
										placeholderText:{color:'#565454'}}} 
									placeholder={this.state.startDate} 
									format="ddd., MMM DD, YYYY" 
									minDate={this.state.minStartDate} 
									maxDate={this.state.maxStartDate}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									onDateChange={this.startDateOnDateChange} />
									
								<DatePicker showIcon={false} 
									time={this.state.startTime} 
									mode="time" 
									disabled = {this.state.disabledStartTime}
									style={{width:80}}
									customStyles={{
										disabled:{backgroundColor: 'transparent'}, 
										dateInput:{borderWidth: 0}, 
										dateText:{fontFamily: 'OpenSans-Regular'}, 
										placeholderText:{
											color:'#565454', 
											textDecorationLine: this.state.disabledStartTime ? 'line-through' : 'none'}}}
									placeholder={this.getTwelveHourTime(this.state.startTime.split(':')[0] + ':' + this.state.startTime.split(':')[1] +  this.state.amPmStart)} 
									format="HH:mm A" 
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									is24Hour={false}
									onDateChange={this.startTimeOnDateChange}/>
							</View>

							<View style={styles.rowTimeSection}>
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
									time={this.state.endTime} 
									mode="time" 
									disabled = {this.state.disabledEndTime}
									style={{width:80}}
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
									onDateChange={this.endTimeOnDateChange}/>
							</View>
						</View>

						<View style={styles.description}>

							<View style={styles.textInput}>
								<MaterialIcons name="location-on" size={30} color={blueColor} />

								<View style={styles.textInputBorder}>
									<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} 
										placeholder="Location" 
										onChangeText={(location) => this.setState({location})} 
										value={this.state.location}/>
								</View>
							</View>

							<View style={styles.textInput}>
								<MaterialCommunityIcons name="text-short" size={30} color={blueColor} />

								<View style={styles.textInputBorder}>
									<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} 
										placeholder="Description" 
										onChangeText={(description) => this.setState({description})} 
										value={this.state.description}/>
								</View>
							</View>

							<View style={styles.textInput}>
								<Feather name="repeat" size={30} color={blueColor} />

								<View style={styles.textInputBorder}>
									{
										Platform.OS === 'ios' ? 
											<Text onPress={this.recurrenceOnClick}>{this.state.recurrenceValue}</Text>
											:	
											<Picker style={styles.recurrence} 
												selectedValue={this.state.recurrence} 
												onValueChange={(recurrenceValue) => this.setState({recurrence: recurrenceValue})}>
												<Picker.Item label="None" value="None" />
												<Picker.Item label="Everyday" value="everyday" />
												<Picker.Item label="Weekly" value="weekly" />
												<Picker.Item label="Monthly" value="monthly" />
											</Picker>
									}
								</View>
							</View>

						</View>

						<View style={styles.buttons}>
							<TouchableOpacity style={styles.buttonEvent}> 
								<Text style={styles.buttonEventText}>ADD ANOTHER{'\n'}EVENT</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.buttonNext} onPress={this.nextScreen}>
								<Text style={styles.buttonNextText}>NEXT</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

				<TutorialStatus active={2} color={blueColor} backgroundColor={'white'} skip={this.skip} />
			</View>
		);
	}
}

const containerWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		marginTop: StatusBar.currentHeight + Header.HEIGHT,
		flex: 1
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#565454',
		fontSize: 20,
		width: 220,
		textAlign: 'right',
		paddingRight: 15
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

	blueTitle: {
		color: blueColor,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 18,
		width: 70
	},
	
	timeSection: {
		alignItems: 'center',
		marginBottom: -20
		
	},

	allDay: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		width: containerWidth,
		paddingLeft: 45,
		paddingRight: 5
	},

	rowTimeSection: {
		flexDirection: 'row',
		alignItems: 'center',
		width: containerWidth,
		justifyContent: 'space-between',
		paddingLeft: 45,
		paddingRight: 5
	},

	recurrence:{
		color: '#565454',
		height: 40,
		width: '105%',
		marginLeft: -5,
		marginBottom:-8
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

export default FixedEvent;