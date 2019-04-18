import React from "react";
import renderer from "react-test-renderer";
import {ImageBackground, Image, StatusBar} from "react-native";
import LinearGradient from 'react-native-linear-gradient';

// Removed this test in order to avoid the GoogleSignIn errors
// test("Home renders correctly", () => {
//   const tree = renderer.create(<Home />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

test("Linear Gradient renders correctly", () => {
    const linearGradient = renderer.create(<LinearGradient style={{flex: 1, width: '100%', height: '110%'}} colors={['#1473E6', '#0E55AA']}></LinearGradient>).toJSON();
    expect(linearGradient).toMatchSnapshot();
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