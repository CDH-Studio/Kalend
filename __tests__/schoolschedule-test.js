import React from 'react';
import renderer from 'react-test-renderer';
// import SchoolSchedule from '../src/components/screens/SchoolSchedule';
import {ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';


// test("SchoolSchedule renders correctly", () => {
// 	const tree = renderer.create(<SchoolSchedule />).toJSON();
// 	expect(tree).toMatchSnapshot();
// });

test("Linear Gradient renders correctly", () => {
	const linearGradient = renderer.create(<LinearGradient style={{flex: 1, width: '100%', height: '110%'}} colors={['#1473E6', '#0E55AA']}></LinearGradient>).toJSON();
	expect(linearGradient).toMatchSnapshot();
});

test("StatusBar renders correctly", () => {
	const statusBar = renderer.create(<StatusBar translucent={true} backgroundColor={'#00000050'}/>).toJSON();
	expect(statusBar).toMatchSnapshot();
});

test("Buttons render correctly", () => {
	const button = renderer.create(<TouchableOpacity style={styles.buttonSelect} onPress={() => this.props.navigation.navigate('SchoolScheduleSelectPicture')}>
		<Text style={styles.buttonSelectText}>SELECT A PICTURE</Text>
	</TouchableOpacity>).toJSON();
	expect(button).toMatchSnapshot();
});

test('Icons render correctly', () => {
	const icon = renderer.create(<FontAwesome5 name="university" size={130} color='#ffffff'/>).toJSON();
	expect(icon).toMatchSnapshot();
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		paddingLeft: 15,
		width: 220
	},

	button: {
		alignItems: 'center',
		marginTop: -100
	},

	buttonSelect: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		padding: 17,
		paddingVertical: 21.15,
		alignItems: 'center',
		width: 300,
		elevation: 4
	},

	buttonSelectText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#1473E6',
		
	},

	buttonTake: {
		borderRadius: 12,
		backgroundColor: 'transparent',
		borderWidth: 3,
		borderColor: '#FFFFFF',
		padding: 17,
		alignItems: 'center',
		marginTop: 20,
		width: 300,
		elevation: 4
	},

	buttonTakeText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		fontWeight:'500',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20
	},
});