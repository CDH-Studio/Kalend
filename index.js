import React from 'react';
import { AppRegistry, StatusBar, Platform } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import { blueColor, orangeColor } from './config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import UnavailableHours from './src/components/screens/UnavailableHours';
import ReviewEvent from './src/components/screens/ReviewEvent';
import Dashboard from './src/components/screens/Dashboard';
import Chatbot from './src/components/screens/Chatbot';
import CompareSchedule from './src/components/screens/CompareSchedule';
import Settings from './src/components/screens/Settings';
import SchoolInformation from './src/components/screens/SchoolInformation';
import { blue } from './src/styles.js';

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

const dashboardInnerScreenOptions = {
	headerTintColor: '#fff',
	headerTitleStyle: {fontFamily: 'Raleway-Regular'},
	headerStyle: {
		backgroundColor: blue,
		marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
	},
};

const DashboardNavigator = createBottomTabNavigator(
	{
		Dashboard: {
			screen: createStackNavigator({
				Dashboard: {
					screen: Dashboard,
					navigationOptions:  {
						...dashboardInnerScreenOptions,
						title: 'Home'
					}
				}
			}),
			navigationOptions: {
				tabBarIcon: ({ focused, tintColor }) => {
					const iconName = `home-variant${focused ? '' : '-outline'}`;
					return <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />;
				},
			}
		},
		Chatbot: {
			screen: createStackNavigator({
				Chatbot: {
					screen: Chatbot,
					navigationOptions:  {
						...dashboardInnerScreenOptions,
						title: 'Chatbot'
					}
				}
			}),
			navigationOptions: {
				tabBarIcon: ({ focused, tintColor }) => {
					const iconName = `chat-bubble${focused ? '' : '-outline'}`;
					return <MaterialIcons name={iconName} size={25} color={tintColor} />;
				},
			}
		},
		CompareSchedule: {
			screen: createStackNavigator({
				CompareSchedule: {
					screen: CompareSchedule,
					navigationOptions:  {
						...dashboardInnerScreenOptions,
						title: 'Compare Schedules'
					}
				}
			}),
			navigationOptions: {
				title: 'Compare',
				tabBarIcon: ({ focused, tintColor }) => {
					const iconName = `people${focused ? '' : '-outline'}`;
					return <MaterialIcons name={iconName} size={25} color={tintColor} />;
				},
			}
		},
		Settings: {
			screen: createStackNavigator({
				Settings: {
					screen: Settings,
					navigationOptions: {
						...dashboardInnerScreenOptions,
						title: 'Settings'
					}
				}
			}),
			navigationOptions: {
				tabBarIcon: ({ focused, tintColor }) => {
					const iconName = `settings${focused ? '' : '-outline'}`;
					return <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />;
				},
			}
		}
	}, 
	{
		initialRouteName: 'Dashboard',
		tabBarOptions: {
			activeTintColor: blue,
		}
	}
);

DashboardNavigator.navigationOptions = {
	header: null
};

const DashboardOptionsNavigator = createStackNavigator(
	{
		DashboardNavigator,
		SchoolSchedule: {screen: SchoolSchedule},
		AddCourse: {screen: Course},
		SchoolScheduleSelectPicture: {screen: SchoolScheduleSelectPicture},
		SchoolScheduleTakePicture: {screen: SchoolScheduleTakePicture},
		SchoolScheduleCreation: {screen: SchoolScheduleCreation},

		FixedEvent: {screen: FixedEvent},
		NonFixedEvent: {screen: NonFixedEvent},
		SchoolInformation: {screen: SchoolInformation}, 

		ReviewEvent: {screen: ReviewEvent},
		EditCourse: {screen: Course},
		EditFixedEvent: {screen: FixedEvent},
		EditNonFixedEvent: {screen: NonFixedEvent},
		ScheduleCreation: {screen: ScheduleCreation},
		ScheduleSelection: {screen: ScheduleSelection},
		ScheduleSelectionDetails: {screen: ScheduleSelectionDetails},

		UnavailableHours: {screen: UnavailableHours},
		UnavailableFixed: {screen: FixedEvent},
	}, 
	{
		initialRouteName: 'DashboardNavigator',
		defaultNavigationOptions: {
			headerTintColor: 'white',
			headerTitleStyle: {
				fontFamily: 'Raleway-Regular'
			},
			headerStyle: {
				marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
			}
		}
	}
);

const MainNavigator = createSwitchNavigator(
	{
		WelcomeScreen,
		LoadingScreen,
		DashboardOptionsNavigator,
		LoginNavigator,
	},
	{
		initialRouteName: 'LoadingScreen'
	}
);

const AppContainer = createAppContainer(MainNavigator);

StatusBar.setBarStyle('light-content', true);

export default function Main() {
	return (
		<Provider store={store}>
			<PersistGate loading={null}
				persistor={persistor}>
				<PaperProvider theme={theme}>
					<AppContainer />
				</PaperProvider>
			</PersistGate>
		</Provider>
	);
}

AppRegistry.registerComponent(appName, () => Main);