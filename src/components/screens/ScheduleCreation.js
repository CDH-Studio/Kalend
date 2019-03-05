import React from 'react';
import { StatusBar, Text, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { Surface } from 'react-native-paper';
import { gradientColors, orangeColor, lightOrangeColor } from '../../../config';
import { scheduleCreateStyles as styles } from '../../styles';

/**
 * The loading screen shown after the user reviewed their events
 */
class ScheduleCreation extends React.Component {

	// Removes the header
	static navigationOptions = {
		header: null,
	};

	componentWillMount() {
		// Adds a little delay before going to the next screen
		setTimeout(() => {
			this.navigateToSelection();
		}, 2000);
	}

	/**
	 * Goes to the next screen
	 */
	navigateToSelection = () => {
		if(this.props.navigation.state.routeName === 'TutorialScheduleCreation') {
			this.props.navigation.navigate('TutorialScheduleSelection');
		}else {
			this.props.navigation.navigate('DashboardScheduleSelection');
		}
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
							color={orangeColor} 
							useNativeDriver={true} 
							borderColor={orangeColor} 
							unfilledColor={lightOrangeColor}/>
					</Surface>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default ScheduleCreation;