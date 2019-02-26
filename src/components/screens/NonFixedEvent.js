import React from 'react';
import {Platform, StatusBar, StyleSheet, View, ScrollView, Text, Slider, TouchableOpacity, Switch, Dimensions, TextInput} from 'react-native';
import {Header} from 'react-navigation';
import {blueColor} from '../../../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import NumericInput from 'react-native-numeric-input';
// import RadioForm from 'react-native-simple-radio-button';
import TutorialStatus, {HEIGHT} from '../TutorialStatus';

//TODO
//Add onPress={() => } for Add Another Event button - Removed for now to avoid missing function error
//Add onSubmit functions for buttons + navigate/resetForm

class NonFixedEvent extends React.Component {

	//Style for Navigation Bar
	static navigationOptions = {
		title: 'Add Non-Fixed Events',
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

			//Availability Section
			specificDateRange: false,

			startDate: new Date().toDateString(),
			disabledStartDate: false,
			minStartDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),

			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,

			hours: 0,
			minutes: 0,
			isDividable: false,
			// durationType: 0,

			occurrence: 0,

			//Priority Level Section
			priority: 0,

			location: '',
			description: ''
			
		};
	}

	skip = () => {
		this.props.navigation.navigate('ReviewEvent');
	}

	//Render UI
	render() {
		const containerHeight = Dimensions.get('window').height - Header.HEIGHT;
		// const durationTypes = [
		// 	{label: 'Per Occurence', value: 0 },
		// 	{label: 'Of Event', value: 1 }
		// ];

		let tutorialStatus;

		if(this.props.navigation.state.routeName === 'TutorialNonFixedEvent') {
			tutorialStatus = <TutorialStatus active={3} color={blueColor} backgroundColor={'white'} skip={this.skip} />;
		} else {
			tutorialStatus = null;
		}

		return(
			<View style={styles.container}>
				<StatusBar backgroundColor={'#105dba'} />

				<ScrollView style={styles.content}>
					<View style={{height: this.state.containerHeight, flex:1, paddingBottom:HEIGHT, justifyContent:'space-evenly'}} 
						onLayout={(event) => {
							let {height} = event.nativeEvent.layout;
							if(height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View style={styles.instruction}>
							<MaterialCommunityIcons name="face" size={130} color="#1473E6"/>
							<Text style={styles.instructionText}>Add the events you would like Kalend to plan for you</Text>
						</View>

						<View style={styles.textInput}>
							<MaterialCommunityIcons name="format-title" size={30} color="#1473E6" />
							<View style={styles.textInputBorder}>
								<TextInput style={{fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#565454', paddingBottom:0}} placeholder="Title" onChangeText={(title) => this.setState({title})} value={this.state.title}/>
							</View>
						</View>
						
						<View>
							<Text style={styles.sectionTitle}>Availability</Text>

							<View style={styles.timeSection}>
								<View style={styles.dateRange}>
									<Text style={styles.blueTitleLong}>Specific Date Range</Text>
									<Switch trackColor={{false: 'lightgray', true: '#FFBF69'}} ios_backgroundColor={'lightgray'} thumbColor={this.state.specificDateRange ? '#FF9F1C' : 'darkgray'} onValueChange={(specificDateRange) => this.setState({specificDateRange: specificDateRange})} value = {this.state.specificDateRange} />
								</View>
								
								{this.state.specificDateRange ? /*To hide/show the date*/
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
									</View> : null}
									
								{this.state.specificDateRange ? /*To hide/show the date*/
									<View style={styles.questionLayout}>
										<Text style={styles.blueTitle}>End Date</Text>
										<DatePicker showIcon={false} 
											date={this.state.endDate} 
											mode="date" 
											style={{width:140}}
											disabled={this.state.disabledEndDate}
											customStyles={{ disabled:{backgroundColor: 'transparent'}, dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular', color:'#565454', textDecorationLine: this.state.disabledEndDate ? 'line-through' : 'none'}}} 
											placeholder={this.state.endDate} 
											format="ddd., MMM DD, YYYY" 
											minDate={this.state.minEndDate}
											confirmBtnText="Confirm" 
											cancelBtnText="Cancel" 
											onDateChange={(endDate) => this.setState({endDate, maxStartDate: endDate})} />
									</View> : null}

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
											onValueChange={(hours) => this.setState({hours})} />
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
											onValueChange={(minutes) => this.setState({minutes})} />
										<Text style={styles.optionsText}>minute(s)</Text>
									</View>
								</View>

								<View style={{flexDirection:'row', alignItems:'center'}}>
									<Text style={[styles.blueTitle, {width:150}]}>Is Dividable</Text>
									<Switch trackColor={{false: 'lightgray', true: '#FFBF69'}} ios_backgroundColor={'lightgray'} thumbColor={this.state.isDividable ? '#FF9F1C' : 'darkgray'} onValueChange={(isDividable) => this.setState({isDividable: isDividable})} value = {this.state.isDividable} />
									{/* <Text style={[styles.blueTitle, {width:150}]}>Duration Type</Text>
									<RadioForm
										radio_props={durationTypes}
										initial={0}
										buttonColor={blueColor}
										buttonSize={15}
										labelColor={'#565454'}
										selectedButtonColor={blueColor}
										selectedLabelColor={'#565454'}
										style={{fontFamily:'OpenSans-Regular'}}
										onPress={(durationType) => this.setState({durationType: durationType})}/> */}
								</View>

								<View style={styles.questionLayout}>
									<Text style={styles.blueTitleLong}>{this.state.specificDateRange ? 'Number of Occurences in Date Range' : 'Number of Occurences per Week'}</Text>
									<NumericInput occurrence={this.state.occurrence}
										minValue={0} 
										leftButtonBackgroundColor={'#FFBF69'}
										rightButtonBackgroundColor={'#FF9F1C'}
										rounded={true}
										borderColor={'lightgray'}
										textColor={'#565454'}
										iconStyle={{ color: 'white' }} 
										onValueChange={(occurrence) => this.setState({occurrence})} />
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
						<View>
							<Text style={styles.sectionTitle}>Details</Text>

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
						</View>

						<View style={styles.buttons}>
							<TouchableOpacity style={styles.buttonEvent}> 
								<Text style={styles.buttonEventText}>ADD ANOTHER{'\n'}EVENT</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('ReviewEvent')}>
								<Text style={styles.buttonNextText}>NEXT</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

				{tutorialStatus}	
			</View>
		);
	}
}

const headerHeight = Header.HEIGHT;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		marginTop: StatusBar.currentHeight + headerHeight,
		flex: 1,
		paddingHorizontal: 15
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

	textInput: {
		flexDirection: 'row',
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

	sectionTitle: {
		fontFamily: 'Raleway-Medium',
		fontSize: 19,
		color: '#0A2239',
		marginBottom: 5,
		marginTop: 20
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
		alignItems: 'center',
		marginBottom: 5
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
		fontFamily: 'OpenSans-Regular',
		marginBottom: 5
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 35
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

export default NonFixedEvent;