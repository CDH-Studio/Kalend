import React from 'react';
import renderer from 'react-test-renderer';
// import ReviewEvent from '../src/components/screens/ReviewEvent';
import {StatusBar, StyleSheet} from 'react-native';
import {Header} from 'react-navigation';
import { FAB } from 'react-native-paper';
// import {HEIGHT} from '../src/components/TutorialStatus';

// test("ReviewEvent renders correctly", () => {
//     const tree = renderer.create(<ReviewEvent />).toJSON();
// 	expect(tree).toMatchSnapshot();
// });

test("StatusBar renders correctly", () => {
	const statusBar = renderer.create(<StatusBar translucent={true} backgroundColor={'#105dba'}/>).toJSON();
	expect(statusBar).toMatchSnapshot();
});

test("FAB renders correclty", () => {
    const fab = renderer.create(<FAB style={styles.fab} icon="check"/>).toJSON();
    expect(fab).toMatchSnapshot();
});

// const tutorialHeight = HEIGHT;
// const headerHeight = Header.HEIGHT;
// const containerHeight = containerHeight;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
		// marginTop: StatusBar.currentHeight + headerHeight,
		paddingHorizontal: 25
	},

	content: {
		flex:1,
		justifyContent:'space-evenly',
		// height: containerHeight,
		// paddingBottom: tutorialHeight + 16
	},

	sectionTitle: {
		color: '#565454',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 20,
		marginTop: 20,
		marginBottom: 5
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		zIndex: 1 //To make it go on top of the tutorialStatus
	},
});
