import React from 'react';
import {Platform, StatusBar, View, StyleSheet, ImageBackground, Text} from 'react-native';
import { gradientColors } from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-navigation';

class Schedule extends React.Component {

	render() {
		return {

		};
	}
}

class ScheduleSelection extends React.Component {
	static navigationOptions = {
		title: 'Schedule Selection',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};
	
	render() {
		return(
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<View style={styles.content}>

						<Text style={styles.description}>Below you will find the best weekly schedules created by the application. In order for the AI to work well, please remove the calendars which you don't like</Text>

						{/* <Schedule>
						</Schedule> */}
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default ScheduleSelection;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '130%' //Fixes pattern bug
	},
	content: {
		padding: 10,
		paddingTop: StatusBar.currentHeight + Header.HEIGHT + 10,
	},
	description: {
		color: 'white',
		fontFamily: 'Raleway-Regular',
	}
});