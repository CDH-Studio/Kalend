import React from "react";
import renderer from "react-test-renderer";
import SchoolSchedule from './src/components/SchoolSchedule';
import {ImageBackground, Image, StatusBar} from "react-native";
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