import React from 'react';
import {StatusBar, StyleSheet, View, Text, Platform, TouchableOpacity, TextInput, Switch} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';

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
			allDay: false,
			startDate: new Date().toDateString(),
			minStartDate: new Date().toDateString(),
			endDate: new Date().toDateString(),
			startTime: new Date().toLocaleTimeString(),
			endTime: new Date().toLocaleTimeString()
		};
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
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}}} 
								placeholder={this.state.startDate} 
								format="ddd., MMM DD, YYYY" 
								minDate={this.state.minStartDate} 
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								onDateChange={(startDate) => this.setState({startDate: new Date(startDate).toDateString()})} />
								
							<DatePicker showIcon={false} 
								time={this.state.startTime} 
								mode="time" 
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}}} 
								placeholder={this.state.startTime} 
								format="HH:mm A" 
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								is24Hour={false}
								onDateChange={(startTime) => this.setState({startTime})} />
						</View>

						<View style={styles.end}>
							<Text style={styles.blueTitle}>End</Text>
							<DatePicker showIcon={false} 
								date={this.state.endDate} 
								mode="date" 
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}}} 
								placeholder={this.state.endDate} 
								format="ddd., MMM DD, YYYY" 
								minDate={this.state.startDate} 
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								onDateChange={(endDate) => this.setState({endDate: new Date(endDate).toDateString()})} />

							<DatePicker showIcon={false} 
								time={this.state.endTime} 
								mode="time" 
								customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}}} 
								placeholder={this.state.endTime} 
								format="HH:mm A" 
								confirmBtnText="Confirm" 
								cancelBtnText="Cancel" 
								onDateChange={(endTime) => this.setState({endTime})} />
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
							<MaterialCommunityIcons name="format-title" size={30} color="#1473E6" />
							<View style={styles.textInputBorder}>
								<TextInput style={styles.textInputfont} placeholder="Recurrence" onChangeText={(title) => this.setState({title})} value={this.state.title}/>
							</View>
						</View>

					</View>

					<View style={styles.buttons}>
						<TouchableOpacity style={styles.buttonEvent} onPress={() => this.props.navigation.navigate('SchoolScheduleSelectPicture')}>
							<Text style={styles.buttonEventText}>ADD ANOTHER EVENT</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('SchoolScheduleSelectPicture')}>
							<Text style={styles.buttonNextText}>NEXT</Text>
						</TouchableOpacity>


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
		justifyContent: 'space-evenly'
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
		marginRight: 20
	},

	textInputFont: {
		fontFamily: 'OpenSans-Regular',
		fontSize: 20
	},

	textInputBorder: {
		borderBottomColor: '#979797',
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
		marginLeft: 70
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
});

export default FixedEvent;