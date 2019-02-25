import React from 'react';
import {Platform, StatusBar, StyleSheet, View, ScrollView, Text, Slider, TouchableOpacity, Switch} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import DatePicker from 'react-native-datepicker';
import NumericInput from 'react-native-numeric-input';

//TODO
//Add onPress={() => } for Add Another Event button - Removed for now to avoid missing function error
//Add onSubmit functions for buttons + navigate/resetForm

class NonFixedEvent extends React.Component {

	static navigationOptions = {
		title: 'Add Non-Fixed Events',
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
			//Availability Section
			specificDateRange: false,
			startDate: new Date().toDateString(),
			disabledStartDate: false,
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),
			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,
			selectedHours: 0,
			selectedMinutes: 0,
			hours: 0,
			minutes: 0,

			//Priority Level Section
			priority: 0
			
		};
	}


	render() {
		return(
			<View style={styles.Container}>
				<StatusBar backgroundColor={'#105dba'} />

				<ScrollView contentContainerStyle={styles.content}>
					<View style={styles.instruction}>
						<MaterialCommunityIcons name="face" size={130} color="#1473E6"/>
						<Text style={styles.instructionText}>Add the events you would like Kalend to plan for you</Text>
					</View>
					
					<View>
						<Text style={styles.sectionTitle}>Availability</Text>

						<View style={styles.timeSection}>
							<View style={styles.dateRange}>
								<Text style={styles.blueTitleLong}>Specific Date Range</Text>
								<Switch trackColor={{false: 'lightgray', true: '#FFBF69'}} ios_backgroundColor={'lightgray'} thumbColor={'#FF9F1C'} onValueChange={(specificDateRange) => this.setState({specificDateRange: specificDateRange, disabledStartDate: !this.state.disabledStartDate, disabledEndDate: true})} value = {this.state.specificDateRange} />
							</View>

							<View style={styles.questionLayout}>
								<Text style={styles.blueTitle}>Start Date</Text>
								<DatePicker showIcon={false} 
									date={this.state.startDate} 
									mode="date" 
									style={{width:140}}
									disabled={this.state.disabledStartDate}
									customStyles={{disabled:{backgroundColor: 'transparent'}, dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular', color: this.state.disabledStartDate ? '#FF0000' :'#565454'}}} 
									placeholder={this.state.startDate} 
									format="ddd., MMM DD, YYYY" 
									minDate={this.state.minStartDate} 
									maxDate={this.state.maxStartDate}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									onDateChange={(startDate) => this.setState({startDate: startDate, endDate: startDate, disabledEndDate: false, minEndDate: startDate})} />
							</View>
								
							<View style={styles.questionLayout}>
								<Text style={styles.blueTitle}>End Date</Text>
								<DatePicker showIcon={false} 
									date={this.state.endDate} 
									mode="date" 
									style={{width:140}}
									disabled={this.state.disabledEndDate}
									customStyles={{ disabled:{backgroundColor: 'transparent'}, dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular', color: this.state.disabledEndDate ? '#FF0000' :'#565454'}}} 
									placeholder={this.state.endDate} 
									format="ddd., MMM DD, YYYY" 
									minDate={this.state.minEndDate}
									confirmBtnText="Confirm" 
									cancelBtnText="Cancel" 
									onDateChange={(endDate) => this.setState({endDate, maxStartDate: endDate})} />
							</View>

							<View style={styles.duration}>
								<Text style={styles.blueTitle}>Duration</Text>
								<View style={styles.timePicker}>
									<NumericInput hours={this.state.hours} 
										minValue={0} 
										leftButtonBackgroundColor={'#FFBF69'}
										rightButtonBackgroundColor={'#FF9F1C'}
										rounded={true}
										borderColor={'lightgray'}
										textColor={'#565454'}
										iconStyle={{ color: 'white' }} 
										onValueChange={(hours) => this.setState({hours})}
										onChange={(hours) => this.setState({hours})} />
									<Text style={styles.optionsText}>hour(s)</Text>
								</View>

								<View style={styles.timePicker}>
									<NumericInput minutes={this.state.minutes}
										minValue={0} 
										maxValue={59}
										leftButtonBackgroundColor={'#FFBF69'}
										rightButtonBackgroundColor={'#FF9F1C'}
										rounded={true}
										borderColor={'lightgray'}
										textColor={'#565454'}
										iconStyle={{ color: 'white' }} 
										onValueChange={(minutes) => this.setState({minutes})}
										onChange={(minutes) => this.setState({minutes})} />
									<Text style={styles.optionsText}>minute(s)</Text>
								</View>
							</View>

							<View style={styles.questionLayout}>
								<Text style={styles.blueTitleLong}>Number of Occurrence</Text>
								<NumericInput occurrence={this.state.occurrence}
									minValue={0} 
									leftButtonBackgroundColor={'#FFBF69'}
									rightButtonBackgroundColor={'#FF9F1C'}
									rounded={true}
									borderColor={'lightgray'}
									textColor={'#565454'}
									iconStyle={{ color: 'white' }} 
									onValueChange={(occurrence) => this.setState({occurrence})}
									onChange={(occurrence) => this.setState({occurrence})} />
							</View>
						</View>
					</View>

					<View>
						<Text style={styles.sectionTitle}>Priority Level</Text>

						<Slider 
							value={this.state.priority}
							minimumValue={0}
							maximumValue={1} 
							step={0.5}
							thumbTintColor={'#FF9F1C'}
							minimumTrackTintColor={'#FFBF69'}
							onValueChange={(priority) => this.setState({priority: priority})} />

						<View style={styles.questionLayout}>
							<Text style={styles.optionsText}>Low</Text>
							<Text style={styles.optionsText}>Normal</Text>
							<Text style={styles.optionsText}>High</Text>
						</View>
					</View>

					<View style={styles.buttons}>
						<TouchableOpacity style={styles.buttonEvent}> 
							<Text style={styles.buttonEventText}>ADD ANOTHER{'\n'}EVENT</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('ReviewEvent')}>
							<Text style={styles.buttonNextText}>FINISH</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.section}>
						<View style={styles.emptySection}>
							<Text style={styles.skipButtonText}>Skip</Text>
						</View>

						<View style={styles.sectionIconRow}>
							<Octicons name="primitive-dot" size={20} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIcon} />
							<Octicons name="primitive-dot" size={20} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIcon} />
							<Octicons name="primitive-dot" size={20} color="#1473E6" style={styles.sectionIcon} />
							<Octicons name="primitive-dot" size={20} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIcon} />
							<Octicons name="primitive-dot" size={20} color="rgba(20, 115, 230, 0.50)" style={styles.sectionIcon} />
						</View>
							
						<View>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('ReviewEvent')}>
								<Text style={styles.skipButtonText}>Skip</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flexGrow: 1,
		marginTop: 90,
		paddingLeft: 35,
		paddingRight: 35
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	instructionText: {
		fontFamily: 'Raleway-Regular',
		color: '#565454',
		fontSize: 20,
		width: 205,
		marginLeft: 15
	},

	sectionTitle: {
		fontFamily: 'Raleway-Medium',
		fontSize: 19,
		color: '#0A2239',
		marginBottom: 5,
		marginTop: 10
	},

	blueTitle: {
		color: '#1473E6',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 88
	},

	blueTitleLong: {
		color: '#1473E6',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 200
	},

	timeSection: {
		marginLeft: 10
	},

	dateRange: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	questionLayout: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	duration: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5
	},

	timePicker: {
		flexDirection: 'column',
		alignItems: 'center'
	},

	optionsText: {
		color: '#565454',
		fontFamily: 'OpenSans-Regular'
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15
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
	},

	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 10
	},

	emptySection: {
		opacity: 0 //In order to center the bottom section
	},

	sectionIconRow: {
		flexDirection: 'row',
		marginLeft: 10
	},

	sectionIcon: {
		width: 20,
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

export default NonFixedEvent;