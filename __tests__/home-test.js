import React from "react";
import Home from "../src/components/Home";
import {GoogleSigninButton, GoogleSignin} from 'react-native-google-signin';
import {googleSignIn} from '../services/google_identity';
import renderer from "react-test-renderer";

test("Home renders correctly", () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("Linear Gradient renders correctly", () => {
    const LinearGradient = require('react-native-linear-gradient');
    const linearGradient = renderer.create(<LinearGradient style={styles.container} colors={['#1473E6', '#0E55AA']}></LinearGradient>).toJSON();
    expect(linearGradient).toMatchSnapshot();
});

test("Image Background renders correctly", () => {
    const imageBackground = renderer.create(<ImageBackground  style={styles.container} source={require('../assets/img/loginScreen/backPattern.png')} resizeMode="repeat" ></ImageBackground>).toJSON();
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
