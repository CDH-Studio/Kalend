import React from 'react';
import { StatusBar, BackHandler, Alert, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { Surface } from 'react-native-paper';
import { DashboardNavigator, ScheduleSelectionRoute } from '../../constants/screenNames';
import { generateSchedule } from '../../services/service';
import { scheduleCreateStyles as styles, dark_blue, statusBlueColor } from '../../styles';

/**
 * The loading screen shown after the user reviewed their events
 */
class ScheduleCreation extends React.Component {

	// Removes the header
	static navigationOptions = {
		header: null,
		headerLeft: null,
		gesturesEnabled: false,
	};

	componentWillMount() {
		// Adds a little delay before going to the next screen
		this.generateScheduleService();
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}


	handleBackButton = () => {
		Alert.alert(
			'Are you sure you want to stop the schedule creating process?',
			[
				{
					text: 'No',
					style: 'cancel',
				},
				{text: 'Yes', 
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
					},
				},
			],
			{cancelable: false},
		);
		return true;
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}
	
	generateScheduleService = () => {
		generateSchedule().then(() => {
			this.navigateToSelection();
		});
	}

	/**
	 * Goes to the next screen
	 */
	navigateToSelection = () => {
		this.props.navigation.navigate(ScheduleSelectionRoute);
	}
	
	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					backgroundColor={statusBlueColor} />

				<Surface style={styles.surface}>
					<Text style={styles.title}>Creating your Schedule</Text>

					<Text style={styles.subtitle}>Our AI is now perfecting multiple schedule for you</Text>

					<Progress.Bar style={styles.progressBar} 
						indeterminate={true} 
						width={200} 
						color={dark_blue} 
						useNativeDriver={true} 
						borderColor={dark_blue} 
						unfilledColor={'#79A7D2'}/>
				</Surface>
			</View>
		);
	}
}

export default ScheduleCreation;