import React from 'react';
import renderer from 'react-test-renderer';
// import NonFixedEvent from '../src/components/screens/NonFixedEvent';
// import {Header} from 'react-navigation';
import {StatusBar, TouchableOpacity, StyleSheet, Text, Switch} from 'react-native';
// import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import DatePicker from 'react-native-datepicker';
import NumericInput from 'react-native-numeric-input';

// The test commented out gives erors in Jest since the time changes

// test("NonFixedEvent renders correctly", () => {
// 	const tree = renderer.create(<NonFixedEvent />).toJSON();
// 	expect(tree).toMatchSnapshot();
// });

test("StatusBar renders correctly", () => {
	const statusBar = renderer.create(<StatusBar translucent={true} backgroundColor={'#105dba'}/>).toJSON();
	expect(statusBar).toMatchSnapshot();
});

test('Icons render correctly', () => {
	const icon = renderer.create(<MaterialCommunityIcons name="face" size={130} color="#1473E6" />).toJSON();
	expect(icon).toMatchSnapshot();
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


test('NumericInputs render correctly', () => {
	const numInput = renderer.create(<NumericInput
		minValue={0} 
		leftButtonBackgroundColor={'#FFBF69'}
		rightButtonBackgroundColor={'#FF9F1C'}
		rounded={true}
		borderColor={'lightgray'}
		textColor={'#565454'}
		iconStyle={{ color: 'white' }}
		value = {0}
		onChange={(value) => {
			return value + 1;
		}} />).toJSON();
	expect(numInput).toMatchSnapshot();
});

// test('Slider renders correctly', () => {
// 	const slider = renderer.create(<Slider 
// 		minimumValue={0}
// 		maximumValue={1} 
// 		step={0.5}
// 		thumbTintColor={'#FF9F1C'}
// 		minimumTrackTintColor={'#FFBF69'}/>).toJSON();
// 	expect(slider).toMatchSnapshot();
// });

test("Buttons render correctly", () => {
	const button = renderer.create(<TouchableOpacity style={styles.buttonNext} onPress={() => this.props.navigation.navigate('NonFixedEvent')}>
	<Text style={styles.buttonNextText}>NEXT</Text>
	</TouchableOpacity>).toJSON();
	expect(button).toMatchSnapshot();
});

// const headerHeight = Header.HEIGHT;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	// content: {
	// 	marginTop: StatusBar.currentHeight + headerHeight,
	// 	flex: 1,
	// 	paddingHorizontal: 15
	// },

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