import React from "react";
import renderer from "react-test-renderer";
import { ImageBackground, Image, StatusBar, StyleSheet } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

// test("Home renders correctly", () => {
//   const tree = renderer.create(<Home />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

// test("Linear Gradient renders correctly", () => {
//     const LinearGradient = require('react-native-linear-gradient');
//     const linearGradient = renderer.create(<LinearGradient style={styles.container} colors={['#1473E6', '#0E55AA']}></LinearGradient>).toJSON();
//     expect(linearGradient).toMatchSnapshot();
// });

test("Image Background renders correctly", () => {
    const imageBackground = renderer.create(<ImageBackground  style={styles.container} source={require('../src/assets/img/loginScreen/backPattern.png')} resizeMode="repeat" ></ImageBackground>).toJSON();
    expect(imageBackground).toMatchSnapshot();
});

test("StatusBar renders correctly", () => {
    const statusBar = renderer.create(<StatusBar translucent={true} backgroundColor={'#00000050'}/>).toJSON();
    expect(statusBar).toMatchSnapshot();
});

test('Logo renders correctly', done => {
    Image.getSize('../assets/img/kalendFullLogo.png', (width, height) => {
      const logo = renderer.create(<Image style={{height, width}} />).toJSON();
      expect(logo).toMatchSnapshot();
      done();
    });
});

test('UserIcon renders correctly', done => {
    Image.getSize('../assets/img/loginScreen/userIcon.png', (width, height) => {
      const logo = renderer.create(<Image style={{height, width}} />).toJSON();
      expect(logo).toMatchSnapshot();
      done();
    });
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '110%' //Fixes pattern bug
	},

	content: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},

	logo: {
		height: 100, 
		width: undefined
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		paddingTop: 10,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20
	},

	userIcon: {
		height:'35%'
	},

	signInButton: {
		width: 312, 
		height: 48
	}
});
