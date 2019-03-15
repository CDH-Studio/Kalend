import React from 'react';
import { StatusBar, View, Text, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-navigation';
import { TutorialSchoolSchedule,
	LoginNavigator,
	TutorialSchoolScheduleSelectPicture,
	DashboardSchoolScheduleSelectPicture,
	TutorialSchoolScheduleTakePicture,
	DashboardSchoolScheduleTakePicture,
	TutorialFixedEvent,
	TutorialAddCourse,
	DashboardAddCourse } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import { googleSignOut } from '../../services/google_identity';
import { schoolScheduleStyles as styles, white, dark_blue, statusBlueColor } from '../../styles';

const fixedContainerHeight = Dimensions.get('window').height - StatusBar.currentHeight - Header.HEIGHT;

/**
 * Permits the user to import their school schedule by selecting or taking a picture or by manual import.
 */
class SchoolSchedule extends React.Component {

	static navigationOptions = ({navigation}) => {
		return {
			title: 'Add School Schedule',
			headerTintColor: dark_blue,
			headerTitleStyle: {fontFamily: 'Raleway-Regular'},
			headerStyle: {
				backgroundColor: white,
				marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
			},
			headerRight: navigation.state.routeName === TutorialSchoolSchedule ? (
				<IconButton
					onPress={navigation.getParam('goBack')}
					icon={({size, color}) => (
						<Image name='logout'
							size={size}
							color={color} />
					)}
					color={dark_blue}
					size={25} /> 
			) : null
		};
	};

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
		};
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentDidMount() {
		this.props.navigation.setParams({goBack: this.goBack});
	}

	/**
	 * In order to sign out from the app
	 */
	goBack = () => {
		googleSignOut();
		this.props.navigation.navigate(LoginNavigator);
	}

	/**
	 * In order to open the user's camera roll with permission
	 */
	selectAPicture() {
		if (Platform.OS !== 'ios') {
			requestStoragePermission().then((accepted) => {
				if (accepted) {
					if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
						this.props.navigation.navigate(TutorialSchoolScheduleSelectPicture);
					} else {
						this.props.navigation.navigate(DashboardSchoolScheduleSelectPicture);
					}
				}
			});
		} else {
			if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
				this.props.navigation.navigate(TutorialSchoolScheduleSelectPicture);
			} else {
				this.props.navigation.navigate(DashboardSchoolScheduleSelectPicture);
			}
		}
	}

	/**
	 * In order to open the user's camera with permission
	 */
	cameraCapture() {
		if (Platform.OS !== 'ios') {
			requestCamera().then((accepted) => {				
				if (accepted) {
					if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
						this.props.navigation.navigate(TutorialSchoolScheduleTakePicture);
					} else {
						this.props.navigation.navigate(DashboardSchoolScheduleTakePicture);
					}
				}
			});
		} else {
			if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
				this.props.navigation.navigate(TutorialSchoolScheduleTakePicture);
			} else {
				this.props.navigation.navigate(DashboardSchoolScheduleTakePicture);
			}
		}
	}

	/**
	 * To go to the appropriate Add Course screen according to the current route
	 */
	manualImport() {
		if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
			this.props.navigation.navigate(TutorialAddCourse);
		} else {
			this.props.navigation.navigate(DashboardAddCourse);
		}
	}

	/** 
	 * To go to the next screen without entering any information
	 */
	skip = () => {
		this.props.navigation.navigate(TutorialFixedEvent, {update:false});
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
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