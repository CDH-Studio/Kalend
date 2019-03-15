import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { Surface } from 'react-native-paper';
import { generateSchedule } from '../../services/service';
import { scheduleCreateStyles as styles, dark_blue, statusBlueColor } from '../../styles';
import { TutorialScheduleCreation, TutorialScheduleSelection, DashboardScheduleSelection } from '../../constants/screenNames';

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
		this.generateScheduleService();
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
		if (this.props.navigation.state.routeName === TutorialScheduleCreation) {
			this.props.navigation.navigate(TutorialScheduleSelection);
		} else {
			this.props.navigation.navigate(DashboardScheduleSelection);
		}
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