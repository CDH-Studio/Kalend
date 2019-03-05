import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import { blueColor, orangeColor } from 'config';
import { store, persistor } from './src/store/index';
import Home from './src/components/screens/Home';
import SchoolSchedule from './src/components/screens/SchoolSchedule';
import SchoolScheduleSelectPicture from './src/components/screens/SchoolScheduleSelectPicture';
import SchoolScheduleTakePicture from './src/components/screens/SchoolScheduleTakePicture';
import LoadingScreen from './src/components/screens/LoadingScreen';
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import FixedEvent from './src/components/screens/FixedEvent';
import NonFixedEvent from './src/components/screens/NonFixedEvent';
import SchoolScheduleCreation from './src/components/screens/SchoolScheduleCreation';
import ScheduleCreation from './src/components/screens/ScheduleCreation';
import ScheduleSelection from './src/components/screens/ScheduleSelection';
import ScheduleSelectionDetails from './src/components/screens/ScheduleSelectionDetails';
import Course from './src/components/screens/Course';
import ReviewEvent from './src/components/screens/ReviewEvent';
import Dashboard from './src/components/screens/Dashboard';
import Chatbot from './src/components/screens/Chatbot';
import CompareSchedule from './src/components/screens/CompareSchedule';
import Settings from './src/components/screens/Settings';

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: blueColor,
		accent: orangeColor,
	}
};

const LoginNavigator = createStackNavigator(
	{
		Home
	},
	{
		headerMode: 'none',
		initialRouteName: 'Home'
	}
);

const TutorialNavigator = createStackNavigator(
	{
		TutorialSchoolSchedule: {screen: SchoolSchedule},
		TutorialSchoolScheduleSelectPicture: {screen: SchoolScheduleSelectPicture},
		TutorialSchoolScheduleTakePicture: {screen: SchoolScheduleTakePicture},
		TutorialAddCourse: {screen: Course},
		TutorialSchoolScheduleCreation: {screen: SchoolScheduleCreation},
		TutorialFixedEvent: {screen: FixedEvent},
		TutorialNonFixedEvent: {screen: NonFixedEvent},
		TutorialReviewEvent: {screen: ReviewEvent},
		TutorialEditCourse: {screen: Course},
		TutorialEditFixedEvent: {screen: FixedEvent},
		TutorialEditNonFixedEvent: {screen: NonFixedEvent},
		TutorialScheduleCreation: {screen: ScheduleCreation},
		TutorialScheduleSelection: {screen: ScheduleSelection},
		TutorialScheduleSelectionDetails: {screen: ScheduleSelectionDetails}
	}, 
	{
		initialRouteName: 'TutorialSchoolSchedule'
	}
);

const DashboardNavigator = createBottomTabNavigator(
	{
		Dashboard,
		Chatbot,
		CompareSchedule,
		Settings
	}, 
	{
		initialRouteName: 'Dashboard'
	}
);

const DashboardOptionsNavigator = createStackNavigator(
	{
		DashboardNavigator,
		DashboardSchoolSchedule: {screen: SchoolSchedule},
		DashboardSchoolScheduleSelectPicture: {screen: SchoolScheduleSelectPicture},
		DashboardSchoolScheduleTakePicture: {screen: SchoolScheduleTakePicture},
		DashboardAddCourse: {screen: Course},
		DashboardSchoolScheduleCreation: {screen: SchoolScheduleCreation},
		DashboardEditCourse: {screen: Course},
		DashboardEditFixedEvent: {screen: FixedEvent},
		DashboardEditNonFixedEvent: {screen: NonFixedEvent},
		DashboardReviewEvent: {screen: ReviewEvent},
		DashboardScheduleCreation: {screen: ScheduleCreation},
		DashboardScheduleSelection: {screen: ScheduleSelection},
		DashboardScheduleSelectionDetails: {screen: ScheduleSelectionDetails}
	}, 
	{
		initialRouteName: 'DashboardNavigator'
	});

const MainNavigator = createSwitchNavigator(
	{
		WelcomeScreen,
		LoadingScreen,
		DashboardOptionsNavigator,
		LoginNavigator,
		TutorialNavigator,
	},
	{
		initialRouteName: 'LoadingScreen'
	}
);

const defaultGetStateForAction = TutorialNavigator.router.getStateForAction;
const AppContainer = createAppContainer(MainNavigator);

StatusBar.setBarStyle('light-content', true);
AppRegistry.registerComponent(appName, () => Main);

TutorialNavigator.router.getStateForAction = (action, state) => {
	let nav = store.getState().NavigationReducer;

	if (state && state.routes[state.index].routeName === 'TutorialSchoolSchedule' 
		&& nav.routes && !store.getState().StateReducer.openedApp 
		&& nav.main === 'SchoolSchedule') {
		const routes = [
			...nav.routes,
		];
		store.dispatch({
			...nav,
			type: 'SET_OPENED',
			openedApp: true
		});
		return {
			...state,
			routes,
			index: routes.length - 1,
		};
	} else if (state && state.routes) {
		if(action && action.action == 'FinishSchoolCreation') {
			let routes = [{key:'1',routeName:'TutorialSchoolSchedule',params:{}},{key:'2',routeName:'TutorialFixedEvent',params:{update:false}}];
			return {
				...state,
				routes,
				index: routes.length - 1,
			};
		} else {
			store.dispatch({
				...nav,
				type: 'SET_NAV_SCREEN',
				routes: state.routes
			});
		}
	}
		
	return defaultGetStateForAction(action, state);
};

export default function Main() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<PaperProvider theme={theme}>
					<AppContainer />
				</PaperProvider>
			</PersistGate>
		</Provider>
	);
}