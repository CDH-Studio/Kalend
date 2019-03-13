import React from 'react';
import { StatusBar,BackHandler, Alert,  Text, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { Surface } from 'react-native-paper';
import { generateSchedule } from '../../services/service';
import { gradientColors } from '../../../config';
import { scheduleCreateStyles as styles, orange, lightOrange } from '../../styles';
import { DashboardNavigator } from '../../constants/screenNames';

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
		this.props.navigation.navigate('ScheduleSelection');
	}
	
	render() {
		return(
			<LinearGradient style={styles.container} 
				colors={gradientColors}>
				<ImageBackground style={styles.container} 
					source={require('../../assets/img/loginScreen/backPattern.png')} 
					resizeMode="repeat">
					<StatusBar translucent={true} 
						backgroundColor={'rgba(0, 0, 0, 0.2)'} />

					<Surface style={styles.surface}>
						<Text style={styles.title}>Creating your Schedule</Text>

						<Text style={styles.subtitle}>Our AI is now perfecting multiple schedule for you</Text>

						<Progress.Bar style={styles.progressBar} 
							indeterminate={true} 
							width={200} 
							color={orange} 
							useNativeDriver={true} 
							borderColor={orange} 
							unfilledColor={lightOrange}/>
					</Surface>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default ScheduleCreation;