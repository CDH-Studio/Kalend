import React from 'react';
import {StatusBar, StyleSheet, View, Text, Platform, TouchableOpacity, TextInput, Switch, Picker} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import DatePicker from 'react-native-datepicker';

//TODO
//Add onPress={() => } for Add Another Event button - Removed for now to avoid missing function error
//Add onSubmit functions for buttons + navigate/resetForm

class FixedEvent extends React.Component {
	static navigationOptions = {
		title: 'Add Fixed Events',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: '#1473E6',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	constructor(props) {
		super(props);
		this.state = { 
			title: '',
			location: '',

			//Time section
			allDay: false,
			startDate: new Date().toDateString(),
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),
			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,
			startTime: new Date().toLocaleTimeString(),
			endTime: new Date().toLocaleTimeString(),
			minEndTime: new Date().toLocaleTimeString(),
			disabledEndTime : true,
			amPmStart: this.getAmPm(),
			amPmEnd: this.getAmPm(),

			recurrenceValue: 'none'
		};
	}

	getTwelveHourTime(time) {
		let info = time.split(':');
		time = new Date();
		time.setHours(parseInt(info[0]));
		time.setMinutes(parseInt(info[1]));
		let currentHour = time.getHours();
		let currentMinute = time.getMinutes();
		let amOrPm = ' AM';

		if(currentHour > 12) {
			currentHour = currentHour % 12;
			time.setHours(currentHour);
		}

		if(currentMinute < 10) {
			currentMinute = '0' + currentMinute;
		}

		if (currentHour >= 12) {
			amOrPm = ' PM';
		}

		return time.getHours() + ':' + currentMinute + amOrPm;
	}

	getAmPm() {
		let hours = new Date().getHours();
		return (hours >= 12) ? ' PM' : ' AM';
	}

	timeVerification() {
		let min = new Date();
		if(this.state.startDate === this.state.endDate) {
			min = min.toLocaleTimeString();
			min = this.state.startTime;
			return min;
		} else {
			min.setHours(0);
			min.setMinutes(0);
			return min.toLocaleTimeString();
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<View style={styles.content}>
					<View style={styles.instruction}>
						<Text style={styles.text}>Add your events, office hours, appointments, etc.</Text>
						<MaterialCommunityIcons name="calendar-today" size={130} color="#1473E6" />
					</View>

					<View style={styles.textInput}>
						<MaterialCommunityIcons name="format-title" size={30} color="#1473E6" />
						<View style={styles.textInputBorder}>
							<TextInput style={styles.textInputfont} placeholder="Title" onChangeText={(title) => this.setState({title})} value={this.state.title}/>
						</View>
					</View>
					<View style={styles.timeSection}>
						<View style={styles.allDay}>
							<Text style={styles.blueTitle}>All-Day</Text>
							<Switch trackColor={{false: 'lightgray', true: '#FFBF69'}} ios_backgroundColor={'lightgray'} thumbColor={'#FF9F1C'} onValueChange={(allDay) => this.setState({allDay})} value = {this.state.allDay} />
						</View>

						<View style={styles.start}>
							<Text style={styles.blueTitle}>Start</Text>
							<DatePicker showIcon={false} 
								date={this.state.startDate} 
								mode="date" 
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}} 
								placeholder={this.state.startDate} 
								format="ddd., MMM DD, YYYY" 
								minDate={this.state.minStartDate} 
								maxDate={this.state.maxStartDate}
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								onDateChange={(startDate) => this.setState({startDate, disabledEndDate: false, minEndDate: startDate})} />
								
							<DatePicker showIcon={false} 
								time={this.state.startTime} 
								mode="time" 
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}}
								placeholder={this.state.startTime.split(':')[0] + ':' + this.state.startTime.split(':')[1] +  this.state.amPmStart} 
								format="HH:mm A" 
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								is24Hour={false}
								onDateChange={(startTime) => this.setState({startTime: this.getTwelveHourTime(startTime), amPmStart: '', disabledEndTime: false})} />
						</View>

						<View style={styles.end}>
							<Text style={styles.blueTitle}>End</Text>
							<DatePicker showIcon={false} 
								date={this.state.endDate} 
								mode="date" 
								disabled = {this.state.disabledEndDate}
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}} 
								placeholder={this.state.endDate} 
								format="ddd., MMM DD, YYYY" 
								minDate={this.state.minEndDate}
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								onDateChange={(endDate) => this.setState({endDate, maxStartDate: endDate, minEndTime: this.timeVerification()})} />

							<DatePicker showIcon={false} 
								time={this.state.endTime} 
								mode="time" 
								disabled = {this.state.disabledEndTime}
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}}
								placeholder={this.state.endTime.split(':')[0] + ':' + this.state.endTime.split(':')[1] +  this.state.amPmEnd} 
								format="HH:mm A" 
								minDate={this.state.minEndTime}
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								is24Hour={false}
								onDateChange={(endTime) => this.setState({endTime: this.getTwelveHourTime(endTime), amPmEnd: ''})} />
						</View>
					</View>

					<View style={styles.description}>

						<View style={styles.textInput}>
							<MaterialIcons name="location-on" size={30} color="#1473E6" />
							<View style={styles.textInputBorder}>
								<TextInput style={styles.textInputfont} placeholder="Location" onChangeText={(location) => this.setState({location})} value={this.state.location}/>
							</View>
						</View>

						<View style={styles.textInput}>
							<MaterialCommunityIcons name="text-short" size={30} color="#1473E6" />
							<View style={styles.textInputBorder}>
								<TextInput style={styles.textInputfont} placeholder="Description" onChangeText={(description) => this.setState({description})} value={this.state.description}/>
							</View>
						</View>

						<View style={styles.textInput}>
							<Feather name="repeat" size={30} color="#1473E6" />
							<View style={styles.textInputBorder}>
								<Picker style={styles.recurrence} selectedValue={this.state.recurrence} onValueChange={(recurrenceValue) => this.setState({recurrence: recurrenceValue})}>
									<Picker.Item label="None" value="none" />
									<Picker.Item label="Everyday" value="everyday" />
									<Picker.Item label="Weekly" value="weekly" />
									<Picker.Item label="Monthly" value="monthly" />
								</Picker>
							</View>
						</View>

					</View>

					<View style={styles.buttons}>
						<TouchableOpacity style={styles.buttonEvent}> 
							<Text style={styles.buttonEventText}>ADD ANOTHER EVENT</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('NonFixedEvent')}>
							<Text style={styles.buttonNextText}>NEXT</Text>
						</TouchableOpacity>


					</View>

					<View style={styles.section}>
						<View style={styles.emptySection}>
							<Text style={styles.skipButtonText}>Skip</Text>
						</View>
						<View style={styles.sectionIconRow}>
							<Octicons name="primitive-dot" size={35} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIconActive} />
							<Octicons name="primitive-dot" size={35} color="#1473E6" style={styles.sectionIconInactive} />
							<Octicons name="primitive-dot" size={35} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIconInactive} />
							<Octicons name="primitive-dot" size={35} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIconInactive} />
							<Octicons name="primitive-dot" size={35} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIconInactive} />
						</View>
							
						<View style={styles.skipButton}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('NonFixedEvent')}>
								<Text style={styles.skipButtonText}>Skip</Text>
							</TouchableOpacity>
						</View>
					</View>

				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		marginTop: 100
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
		marginRight: 20,
		height: 40,
		marginTop: 10
	},

	textInputFont: {
		fontFamily: 'OpenSans-Regular',
		fontSize: 20,
		color: '#565454'
	},

	textInputBorder: {
		borderBottomColor: 'lightgray',
		borderBottomWidth: 1,
		width: 320,
		marginLeft: 20
	},

	blueTitle: {
		color: '#1473E6',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 18,
		width: 70
	},
	
	timeSection: {
		marginLeft: 65,
		marginTop: 20
	},

	allDay: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	start: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	end: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	description: {
		marginBottom: 30
	},

	recurrence:{
		color: '#565454',
		height: 40,
		width: 335,
		marginLeft: -5
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	buttonEvent: {
		borderRadius: 12,
		backgroundColor: '#1473E6',
		width: 150,
		height: 60,
		borderWidth: 3,
		borderColor: '#1473E6',
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
		height: 60,
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
	},

	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 30,
		marginBottom: 10
	},

	emptySection: {
		marginLeft: 20,
		opacity: 0 //In order to center the bottom section
	},

	sectionIconRow: {
		flexDirection: 'row',
		marginRight: -20
	},

	sectionIconActive: {
		width: 40,
	},

	sectionIconInactive: {
		width: 40,
	},

	skipButton: {
		marginRight: 20,
		marginBottom: 2
	},

	skipButtonText: {
		color: '#1473E6',
		fontFamily: 'Raleway-Regular',
		fontSize: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10
	}
});

export default FixedEvent;