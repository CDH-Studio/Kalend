// import { NativeModules } from 'react-native';

// jest.mock('react-native-google-signin', () => {
//     const mockGoogleSignin = require('react-native/jest/mockComponent');
//     console.log(mockGoogleSignin.GoogleSignin);
    
//   mockGoogleSignin.GoogleSignin.hasPlayServices = () => Promise.resolve(true);
//   mockGoogleSignin.GoogleSignin.configure = () => Promise.resolve();
//   mockGoogleSignin.GoogleSignin.currentUserAsync = () => {
//     return Promise.resolve({
//       name: 'name',
//       email: 'test@email.com',
//       // .... other user data
//     });
//   };

//   return mockGoogleSignin;
// });

// NativeModules.RNGoogleSignin = {
//     BUTTON_SIZE_ICON: 0,
//     BUTTON_SIZE_STANDARD: 0,
//     BUTTON_SIZE_WIDE: 0,
//     BUTTON_COLOR_AUTO: 0,
//     BUTTON_COLOR_LIGHT: 0,
//     BUTTON_COLOR_DARK: 0,
//     configure: jest.fn(),
//     currentUserAsync: jest.fn(),
//   };