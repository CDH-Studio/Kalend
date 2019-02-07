import React from 'react';
import renderer from 'react-test-renderer';
import SchoolSchedule from '../src/components/SchoolSchedule';
import {ImageBackground, Image, StatusBar, TouchableOpacity, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


test("SchoolSchedule renders correctly", () => {
	const tree = renderer.create(<SchoolSchedule />).toJSON();
	expect(tree).toMatchSnapshot();
});

test("Linear Gradient renders correctly", () => {
	const linearGradient = renderer.create(<LinearGradient style={{flex: 1, width: '100%', height: '110%'}} colors={['#1473E6', '#0E55AA']}></LinearGradient>).toJSON();
	expect(linearGradient).toMatchSnapshot();
});

test("Image Background renders correctly", () => {
	const imageBackground = renderer.create(<ImageBackground  style={{flex: 1, width: '100%', height: '110%'}} source={require('../src/assets/img/loginScreen/backPattern.png')} resizeMode="repeat" ></ImageBackground>).toJSON();
	expect(imageBackground).toMatchSnapshot();
});

test("StatusBar renders correctly", () => {
	const statusBar = renderer.create(<StatusBar translucent={true} backgroundColor={'#00000050'}/>).toJSON();
	expect(statusBar).toMatchSnapshot();
});

test('School icon renders correctly', done => {
	Image.getSize('../assets/img/schoolSchedule/school.png', (width, height) => {
	  const school= renderer.create(<Image style={{height, width}} />).toJSON();
	  expect(school).toMatchSnapshot();
	  done();
	});
});

test("Buttons render correctly", () => {
	const button = renderer.create(<TouchableOpacity style={styles.buttonSelect} onPress={() => this.props.navigation.navigate('SchoolScheduleSelectPicture')}>
	<Text style={styles.buttonSelectText}>SELECT A PICTURE</Text>
</TouchableOpacity>).toJSON();
	expect(button).toMatchSnapshot();
});

test('Active section icon renders correctly', done => {
	Image.getSize('../assets/img/schoolSchedule/sectionActive.png', (width, height) => {
	  const aSection = renderer.create(<Image style={{height, width}} />).toJSON();
	  expect(aSection).toMatchSnapshot();
	  done();
	});
});

test('Inactive section icon renders correctly', done => {
	Image.getSize('../assets/img/schoolSchedule/sectionInactive.png', (width, height) => {
	  const iSection = renderer.create(<Image style={{height, width}} />).toJSON();
	  expect(iSection).toMatchSnapshot();
	  done();
	});
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	content: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginTop: 160
	},

	schoolIcon: {
		height: 130,
		width: 130
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center'
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		paddingTop: 30,
		paddingLeft: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20,
		width: 220
	},

	button: {
		alignItems: 'center'
	},

	buttonSelect: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		padding: 17,
		alignItems: 'center',
		width: 300,
		borderWidth: 3,
		borderColor: '#FFFFFF',
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

	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 50,
		marginBottom: 10
	},

	emptySection: {
		marginLeft: 20,
		opacity: 0
	},

	sectionIconRow: {
		flexDirection: 'row'
	},

	sectionIcon: {
		width: 20,
		height: 20,
		margin: 8
	},

	skipButton: {
		marginRight: 20,
		marginBottom: 2
	},

	skipButtonText: {
		color: 'white',
		fontFamily: 'Raleway-Regular',
		fontSize: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10
	}
});