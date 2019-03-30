import React from 'react';
import { StatusBar, View, Text, Platform, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SchoolScheduleSelectPictureRoute, SchoolScheduleTakePictureRoute, CourseRoute } from '../../constants/screenNames';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import { schoolScheduleStyles as styles, dark_blue, statusBlueColor } from '../../styles';
import updateNavigation from '../NavigationHelper';

/**
 * Permits the user to import their school schedule by selecting or taking a picture or by manual import.
 */
class SchoolSchedule extends React.PureComponent {

	static navigationOptions =  {
		title: 'Add School Schedule',
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
		},
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
					this.props.navigation.navigate(SchoolScheduleSelectPictureRoute);
				}
			});
		} else {
			this.props.navigation.navigate('SchoolScheduleSelectPicture');
		}
	}

	/**
	 * In order to open the user's camera with permission
	 */
	cameraCapture() {
		if (Platform.OS !== 'ios') {
			requestCamera().then((accepted) => {				
				if (accepted) {
					this.props.navigation.navigate(SchoolScheduleTakePictureRoute);
				}
			});
		} else {
			this.props.navigation.navigate(SchoolScheduleTakePictureRoute);
		}
	}

	/**
	 * To go to the appropriate Add Course screen according to the current route
	 */
	manualImport() {
		this.props.navigation.navigate(CourseRoute);
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
						<Text style={styles.text}>Import your school schedule by importing or taking a picture</Text>
					</View>
					
					<View style={styles.button}>
						<TouchableOpacity style={styles.buttonSelect}
							onPress={() => this.selectAPicture()}>
							<Text style={styles.buttonSelectText}>SELECT A PICTURE</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.buttonTake}
							onPress={() => this.cameraCapture()}>
							<Text style={styles.buttonTakeText}>TAKE A PICTURE</Text>
						</TouchableOpacity>
							
						<Text style={styles.manual}>
							<Text style={styles.textManual}>or import your school schedule </Text>
								
							<Text style={styles.buttonManual}
								onPress={() => this.manualImport()}>manually</Text>

							<Text style={styles.textManual}>.</Text>

						</Text>
					</View>
				</View>
			</View>
		);
	}
}

export default SchoolSchedule;