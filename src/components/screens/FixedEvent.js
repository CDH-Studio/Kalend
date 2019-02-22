import React from 'react';
import {StatusBar, StyleSheet, View, Text, Platform, TouchableOpacity, TextInput, Switch, Picker, ActionSheetIOS, ScrollView, Dimensions} from 'react-native';
import {Header} from 'react-navigation';
import { blueColor } from '../../../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-datepicker';
import TutorialStatus, {HEIGHT} from '../TutorialStatus';

//TODO
//Add onPress={() => } for Add Another Event button - Removed for now to avoid missing function error
//Add onSubmit functions for buttons + navigate/resetForm

class FixedEvent extends React.Component {

	//Style for Navigation Bar
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

	//Constructor and States
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

	//Methods
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

	getAmPm() {
		let hours = new Date().getHours();
		return (hours >= 12) ? ' PM' : ' AM';
	}

	setMinEndTime() {
		let min = new Date();

		if(this.state.startDate === this.state.endDate) {
			this.state.endTime = this.state.startTime;
			min = min.toLocaleTimeString();
			min = this.state.startTime;
			return min;
		} else {
			//do nothing
		}
	}

	beforeStartTime(endTime) {
		//Start Time
		let start = this.state.startTime;
		let tempStart = start.split(' ');
		let amOrPmStart = tempStart[1];

		let infoStart = start.split(':');
		start = new Date();

		start.setHours(parseInt(infoStart[0]));
		start.setMinutes(parseInt(infoStart[1]));

		let startHour = start.getHours();
		let startMinute = start.getMinutes();

		//End Time
		let end = endTime;
		let tempEnd = end.split(' ');
		let amOrPmEnd = tempEnd[1];

		let infoEnd = end.split(':');
		end = new Date();

		end.setHours(parseInt(infoEnd[0]));
		end.setMinutes(parseInt(infoEnd[1]));

		let endHour = end.getHours();
		let endMinute = end.getMinutes();

		//Comparing start and end time
		if(startHour == 12 && amOrPmStart == 'PM' && amOrPmEnd == 'PM' && endHour < startHour) {
			return endTime;
		} else if(startHour == 12 && amOrPmStart == 'PM' && amOrPmEnd == 'PM' && endHour == startHour && endMinute < startMinute) {
			endTime = this.state.startTime;
			return endTime;
		} else if(startHour == 12 && amOrPmStart == 'PM' && amOrPmEnd == 'AM' && endHour < startHour) {
			endTime = this.state.startTime;
			return endTime;
		} else if(endHour == 12 && amOrPmStart == 'PM' && amOrPmEnd == 'PM' && endHour > startHour) {
			endTime = this.state.startTime;
			return endTime;
		} else if(endHour == 12 && amOrPmStart == 'PM' && amOrPmEnd == 'PM' && endHour > startHour && endMinute < startMinute) {
			endTime = this.state.startTime;
			return endTime;
		} else if(amOrPmStart == 'PM' && amOrPmEnd == 'AM') {
			endTime = this.state.startTime;
			return endTime;
		} else if(startHour == endHour) {
			if(startMinute > endMinute) {
				endTime = this.state.startTime;
				return endTime;
			}
		} else if(startHour > endHour) {
			endTime = this.state.startTime;
			return endTime;
		} else {
			return endTime;
		}
	}

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

	skip = () => {
		this.props.navigation.navigate('NonFixedEvent');
	}

	//Render UI
	render() {
		const containerHeight = Dimensions.get('window').height - Header.HEIGHT;
		return (
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<ScrollView style={styles.content}>
					<View style={{height: this.state.containerHeight, flex:1, paddingBottom:HEIGHT, justifyContent:'space-evenly'}} 
						onLayout={(event) => {
							let {height} = event.nativeEvent.layout;
							if(height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add your events, office hours, appointments, etc.</Text>
							<MaterialCommunityIcons name="calendar-today" size={130} color="#1473E6"/>
						</View>

						<View style={styles.textInput}>
							<MaterialCommunityIcons name="format-title" size={30} color="#1473E6" />
							<View style={styles.textInputBorder}>
								<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} placeholder="Title" onChangeText={(title) => this.setState({title})} value={this.state.title}/>
							</View>
						</View>
						<View style={styles.timeSection}>
							<View style={styles.allDay}>
								<Text style={styles.blueTitle}>All-Day</Text>
								<View style={{width: 130, alignItems:'flex-start'}}>
									<Switch 
										trackColor={{false: 'lightgray', true: '#FFBF69'}} 
										ios_backgroundColor={'lightgray'} 
										thumbColor={this.state.allDay ? '#FF9F1C' : 'darkgray'} 
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
									onDateChange={(startDate) => this.setState({
										startDate: startDate, 
										disabledEndDate: false, 
										minEndDate: startDate, 
										endDate: (this.state.disabledEndDate || new Date(startDate) > new Date(this.state.endDate)) ? startDate : this.state.endDate})} />
									
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
									onDateChange={(startTime) => this.setState({
										startTime: this.getTwelveHourTime(startTime), 
										amPmStart: '', 
										endTime: this.state.disabledEndTime ? startTime : this.beforeStartTime(this.getTwelveHourTime(this.state.endTime)), 
										amPmEnd: ''})} />
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
									onDateChange={(endDate) => this.setState({
										endDate: endDate, 
										maxStartDate: endDate, 
										minEndTime: this.setMinEndTime(), 
										disabledEndTime: false})} />

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
									onDateChange={(endTime) => this.setState({
										endTime: this.beforeStartTime(this.getTwelveHourTime(endTime)), 
										amPmEnd: ''})} />
							</View>
						</View>

						<View style={styles.description}>

							<View style={styles.textInput}>
								<MaterialIcons name="location-on" size={30} color="#1473E6" />
								<View style={styles.textInputBorder}>
									<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} placeholder="Location" onChangeText={(location) => this.setState({location})} value={this.state.location}/>
								</View>
							</View>

							<View style={styles.textInput}>
								<MaterialCommunityIcons name="text-short" size={30} color="#1473E6" />
								<View style={styles.textInputBorder}>
									<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} placeholder="Description" onChangeText={(description) => this.setState({description})} value={this.state.description}/>
								</View>
							</View>

							<View style={styles.textInput}>
								<Feather name="repeat" size={30} color="#1473E6" />
								<View style={styles.textInputBorder}>
									{
										Platform.OS === 'ios' ? 
											<Text onPress={this.recurrenceOnClick}>{this.state.recurrenceValue}</Text>
											:	
											<Picker style={styles.recurrence} selectedValue={this.state.recurrence} onValueChange={(recurrenceValue) => this.setState({recurrence: recurrenceValue})}>
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

							<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('NonFixedEvent')}>
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
		color: '#1473E6',
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
		backgroundColor: '#1473E6',
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
		borderColor: '#1473E6',
		elevation: 4,
		justifyContent:'center'
	},

	buttonNextText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#1473E6',
		textAlign: 'center',
		padding: 8
	}
});

export default FixedEvent;