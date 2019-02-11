import {AppRegistry} from 'react-native';
import Home from './src/components/screens/Home';
import SchoolSchedule from './src/components/screens/SchoolSchedule';
import SchoolScheduleSelectPicture from './src/components/screens/SchoolScheduleSelectPicture';
import SchoolScheduleTakePicture from './src/components/screens/SchoolScheduleTakePicture';
import LoadingScreen from './src/components/screens/LoadingScreen';
import FixedEvent from './src/components/screens/FixedEvent';
import NonFixedEvent from './src/components/screens/NonFixedEvent';
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

// const SchoolScheduleAnalysisNavigator = createStackNavigator(
// 	{
// 		SchoolScheduleAnalysis: {screen: SchoolScheduleAnalysis}
// 	}, 
// 	{
// 		headerMode: 'none',
// 		initialRouteName: 'SchoolScheduleAnalysis'
// 	}
// );

const TutorialNavigator = createStackNavigator(
	{
		SchoolSchedule: SchoolSchedule,
		SchoolScheduleSelectPicture: SchoolScheduleSelectPicture,
		SchoolScheduleTakePicture: SchoolScheduleTakePicture,
		FixedEvent: FixedEvent,
		NonFixedEvent: NonFixedEvent,
		//ReviewEvent: {screen: ReviewEvent},
		//ScheduleSelection: {screen: ScheduleSelection},
		//ScheduleSelectionDetails: {screen: ScheduleSelectionDetails}
	}, 
	{
		initialRouteName: 'SchoolSchedule'
	}
);

// const CreateScheduleNavigator = createStackNavigator(
// 	{
// 		CreateSchedule: {screen: CreateSchedule}
// 	}, 
// 	{
// 		headerMode: 'none',
// 		initialRouteName: 'CreateSchedule'
// 	}
// );

// const DashboardNavigator = createStackNavigator(
// 	{
// 		Dashboard: {screen: Dashboard},
// 		DashboardOptions: {screen: DashboardOptionsNavigator},
// 		Chatbot: {screen: Chatbot},
// 		Settings: {screen: Settings}
// 	}, 
// 	{
// 		initialRouteName: 'Dashboard'
// 	}
// );

// const DashboardOptionsNavigator = createStackNavigator(
// 	{
// 		SchoolSchedule: {screen: SchoolScheduleNavigator},
// 		FixedEvent: {screen: FixedEvent},
// 		NonFixedEvent: {screen: NonFixedEvent},
// 		ScheduleSelection: {screen: ScheduleSelectionNavigator},
// 		CompareSchedule: {screen: CompareScheduleNavigator}
// 	}
// );

// const CompareScheduleNavigator = createStackNavigator(
// 	{
// 		CompareSchedule: {screen: CompareSchedule},
// 		CompareScheduleDetails: {screen: CompareScheduleDetails}
// 	}, 
// 	{
// 		initialRouteName: 'CompareSchedule'
// 	}
// );

const MainNavigator = createAppContainer(createSwitchNavigator(
	{
		LoadingScreen: {screen: LoadingScreen},
		//Dashboard: DashboardNavigator,
		LoginNavigator: LoginNavigator,
		TutorialNavigator: TutorialNavigator
	},
	{
		headerMode: 'none',
		initialRouteName: 'LoadingScreen'
	}
));