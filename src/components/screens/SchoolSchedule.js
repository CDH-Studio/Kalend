import React from 'react';
import { StatusBar, View, Text, Platform, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SchoolScheduleSelectPictureRoute, SchoolScheduleTakePictureRoute, CourseRoute } from '../../constants/screenNames';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import { schoolScheduleStyles as styles, dark_blue, statusBlueColor } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { getStrings } from '../../services/helper';

/**
 * Permits the user to import their school schedule by selecting or taking a picture or by manual import.
 */
class SchoolSchedule extends React.PureComponent {

	strings = getStrings().SchoolSchedule;

	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.state.params.title,
			headerTransparent: true,
			headerStyle: {
				backgroundColor: 'rgba(0, 0, 0, 0.2)',
			},
		};
	};

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
		};

		// Updates the navigation location in redux
		updateNavigation('SchoolSchedule', props.navigation.state.routeName);
	}

	/**
	 * In order to open the user's camera roll with permission
	 */
	selectAPicture() {
		if (Platform.OS !== 'ios') {
			requestStoragePermission().then((accepted) => {
				if (accepted) {
					this.props.navigation.navigate(SchoolScheduleSelectPictureRoute, {title: getStrings().SchoolScheduleSelectPicture.title});
				}
			});
		} else {
			this.props.navigation.navigate('SchoolScheduleSelectPicture', {title: getStrings().SchoolScheduleSelectPicture.title});
		}
	}

	/**
	 * In order to open the user's camera with permission
	 */
	cameraCapture() {
		if (Platform.OS !== 'ios') {
			requestCamera().then((accepted) => {				
				if (accepted) {
					this.props.navigation.navigate(SchoolScheduleTakePictureRoute, {title: getStrings().SchoolScheduleTakePicture.title});
				}
			});
		} else {
			this.props.navigation.navigate(SchoolScheduleTakePictureRoute, {title: getStrings().SchoolScheduleTakePicture.title});
		}
	}

	/**
	 * To go to the appropriate Add Course screen according to the current route
	 */
	manualImport() {
		this.props.navigation.navigate(CourseRoute,  {title: getStrings().Course.addTitle});
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<View style={styles.content}>
					<View style={styles.instruction}>
						<FontAwesome5 name="university"
							size={130}
							color={dark_blue} />
						<Text style={styles.text}>{this.strings.description}</Text>
					</View>
					
					<View style={styles.button}>
						<TouchableOpacity style={styles.buttonSelect}
							onPress={() => this.selectAPicture()}>
							<Text style={styles.buttonSelectText}>{this.strings.selectPicture}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.buttonTake}
							onPress={() => this.cameraCapture()}>
							<Text style={styles.buttonTakeText}>{this.strings.takePicture}</Text>
						</TouchableOpacity>
							
						<Text style={styles.manual}>
							<Text style={styles.textManual}>{this.strings.manual}</Text>
								
							<Text style={styles.buttonManual}
								onPress={() => this.manualImport()}>{this.strings.manually}</Text>

							<Text style={styles.textManual}>.</Text>

						</Text>
					</View>
				</View>
			</View>
		);
	}
}

export default SchoolSchedule;