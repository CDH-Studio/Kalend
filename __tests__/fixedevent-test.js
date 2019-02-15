import React from 'react';
import renderer from 'react-test-renderer';
import FixedEvent from '../src/components/screens/FixedEvent';
import {StatusBar, TouchableOpacity, StyleSheet, Text} from 'react-native';

test("SchoolSchedule renders correctly", () => {
	const tree = renderer.create(<FixedEvent />).toJSON();
	expect(tree).toMatchSnapshot();
});

test("StatusBar renders correctly", () => {
	const statusBar = renderer.create(<StatusBar translucent={true} backgroundColor={'#105dba'}/>).toJSON();
	expect(statusBar).toMatchSnapshot();
});

test('Icons render correctly', () => {
	  const icon = renderer.create(<MaterialCommunityIcons name="calendar-today" size={130} color="#1473E6" />).toJSON();
	  expect(icon).toMatchSnapshot();
});

test('Text inputs render correctly', () => {
	const textInput = renderer.create(<TextInput style={styles.textInputfont} placeholder="Title" />).toJSON();
	expect(textInput).toMatchSnapshot();
});

test('Switch renders correctly', () => {
	const switchComponent = renderer.create(<Switch trackColor={{false: 'lightgray', true: '#FFBF69'}} ios_backgroundColor={'lightgray'} thumbColor={'#FF9F1C'} />).toJSON();
	expect(switchComponent).toMatchSnapshot();
});

test('DatePickers render correctly', () => {
	const datePicker = renderer.create(<DatePicker showIcon={false} 
		mode="date" 
		style={{width:140}}
		customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}} 
		format="ddd., MMM DD, YYYY"
		confirmBtnText="Confirm" 
		cancelBtnText="Cancel" />).toJSON();
	expect(datePicker).toMatchSnapshot();
});

test('TimePickers render correctly', () => {
	const timePicker = renderer.create(<DatePicker showIcon={false} 
		mode="time" 
		style={{width:80}}
		customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}}
		format="HH:mm A" 
		confirmBtnText="Confirm" 
		cancelBtnText="Cancel" 
		is24Hour={false} />).toJSON();
	expect(timePicker).toMatchSnapshot();
});

test('Picker renders correctly', () => {
	const recurrencePicker = renderer.create(<Picker style={styles.recurrence}>
	<Picker.Item label="None" value="none" />
	<Picker.Item label="Everyday" value="everyday" />
	<Picker.Item label="Weekly" value="weekly" />
	<Picker.Item label="Monthly" value="monthly" />
	</Picker>).toJSON();
	expect(recurrencePicker).toMatchSnapshot();
  });

test("Buttons render correctly", () => {
	const button = renderer.create(<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('NonFixedEvent')}>
	<Text style={styles.buttonNextText}>NEXT</Text>
	</TouchableOpacity>).toJSON();
	expect(button).toMatchSnapshot();
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		marginTop: 100,
		marginLeft: 20,
		marginRight: 20
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
		height: 40
	},

	textInputFont: {
		fontFamily: 'OpenSans-Regular',
		fontSize: 20,
		color: '#565454'
	},

	textInputBorder: {
		borderBottomColor: 'lightgray',
		borderBottomWidth: 1,
		width: '87%',
		marginLeft: 20
	},

	blueTitle: {
		color: '#1473E6',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 18,
		width: 70
	},
	
	timeSection: {
		paddingTop: 20,
		alignItems: 'center',
		marginLeft: 25
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
		width: '105%',
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
		height: 55,
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
		height: 55,
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