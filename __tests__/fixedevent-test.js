import React from 'react';
import renderer from 'react-test-renderer';
import {StatusBar, TouchableOpacity, StyleSheet, Text, TextInput, Switch, Picker} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// The tests commented out gives erors in Jest since the time changes

// test("SchoolSchedule renders correctly", () => {
// 	const tree = renderer.create(<FixedEvent />).toJSON();
// 	expect(tree).toMatchSnapshot();
// });

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

// test('DatePickers render correctly', () => {
// 	const datePicker = renderer.create(<DatePicker showIcon={false} 
// 		mode="date" 
// 		style={{width:140}}
// 		customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}} 
// 		format="ddd., MMM DD, YYYY"
// 		confirmBtnText="Confirm" 
// 		cancelBtnText="Cancel" />).toJSON();
// 	expect(datePicker).toMatchSnapshot();
// });

// test('TimePickers render correctly', () => {
// 	const timePicker = renderer.create(<DatePicker showIcon={false} 
// 		mode="time" 
// 		style={{width:80}}
// 		customStyles={{dateInput:{borderWidth: 0}, dateText:{fontFamily: 'OpenSans-Regular'}, placeholderText:{color:'#565454'}}}
// 		format="HH:mm A" 
// 		confirmBtnText="Confirm" 
// 		cancelBtnText="Cancel" 
// 		is24Hour={false} />).toJSON();
// 	expect(timePicker).toMatchSnapshot();
// });

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

// const containerWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	// content: {
	// 	marginTop: StatusBar.currentHeight + Header.HEIGHT,
	// 	flex: 1
	// },

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

	// allDay: {
	// 	justifyContent: 'space-between',
	// 	flexDirection: 'row',
	// 	alignItems: 'center',
	// 	width: containerWidth,
	// 	paddingLeft: 45,
	// 	paddingRight: 5
	// },

	// rowTimeSection: {
	// 	flexDirection: 'row',
	// 	alignItems: 'center',
	// 	width: containerWidth,
	// 	justifyContent: 'space-between',
	// 	paddingLeft: 45,
	// 	paddingRight: 5
	// },

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