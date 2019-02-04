/** @format */

import {AppRegistry} from 'react-native';
import Home from './src/components/Home';
import SchoolSchedule from './src/components/SchoolSchedule';
import {name as appName} from './app.json';
import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';

AppRegistry.registerComponent(appName, () => MainNavigator);

const LoginNavigator = createStackNavigator(
    {
      Home: Home
    },
    {
      headerMode: 'none',
      initialRouteName: 'Home'
    }
  );

  const SchoolScheduleNavigator = createStackNavigator(
    {
        SchoolSchedule: SchoolSchedule,
        //SchoolScheduleTakePicture: {screen: SchoolScheduleTakePicture},
        //SchoolScheduleSelectPicture: {screen: SchoolScheduleSelectPicture}
    }, 
    {
        headerMode: 'none',
        initialRouteName: 'SchoolSchedule'

    }
  );

//   const SchoolScheduleAnalysisNavigator = createStackNavigator(
//     {
//         SchoolScheduleAnalysis: {screen: SchoolScheduleAnalysis}
//     }, 
//     {
//         headerMode: 'none',
//         initialRouteName: 'SchoolScheduleAnalysis'

//     }
//   );

  const TutorialNavigator = createStackNavigator(
    {
      SchoolSchedule : {screen: SchoolScheduleNavigator},
      //FixedEvent: {screen: FixedEvent},
      //NonFixedEvent: {screen: NonFixedEvent},
      //ReviewEvent: {screen: ReviewEvent},
      //ScheduleSelection: {screen: ScheduleSelection},
      //ScheduleSelectionDetails: {screen: ScheduleSelectionDetails}
    }, 
    {
        initialRouteName: 'SchoolSchedule'
    }
  );

//   const CreateScheduleNavigator = createStackNavigator(
//     {
//         CreateSchedule: {screen: CreateSchedule}
//     }, 
//     {
//         headerMode: 'none',
//         initialRouteName: 'CreateSchedule'
//     }
//   );

//   const DashboardNavigator = createStackNavigator(
//     {
//       Dashboard: {screen: Dashboard},
//       DashboardOptions: {screen: DashboardOptionsNavigator},
//       Chatbot: {screen: Chatbot},
//       Settings: {screen: Settings}
//     }, 
//     {
//         initialRouteName: 'Dashboard'
//     }
//   );

//   const DashboardOptionsNavigator = createStackNavigator(
//       {
//         SchoolSchedule: {screen: SchoolScheduleNavigator},
//         FixedEvent: {screen: FixedEvent},
//         NonFixedEvent: {screen: NonFixedEvent},
//         ScheduleSelection: {screen: ScheduleSelectionNavigator},
//         CompareSchedule: {screen: CompareScheduleNavigator}
//       }
//   );

//   const CompareScheduleNavigator = createStackNavigator(
//     {
//         CompareSchedule: {screen: CompareSchedule},
//         CompareScheduleDetails: {screen: CompareScheduleDetails}
//     }, 
//     {
//         initialRouteName: 'CompareSchedule'
//     }
//   );



const MainNavigator = createAppContainer(createSwitchNavigator(
    {
        //LoadingScreen: {screen: LoadingScreen},
        //Dashboard: DashboardNavigator,
        LoginNavigator: LoginNavigator,
        TutorialNavigator: TutorialNavigator
    },
    {
        headerMode: 'none',
        initialRouteName: 'LoginNavigator'
    }
));