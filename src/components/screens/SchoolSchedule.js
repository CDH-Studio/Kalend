import React from 'react';
import { ImageBackground, StatusBar, View, Text, Platform, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IconButton } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-navigation';
import { gradientColors } from '../../../config';
import updateNavigation from '../NavigationHelper';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import { googleSignOut } from '../../services/google_identity';
import { schoolScheduleStyles as styles, white } from '../../styles';
import TutorialStatus from '../TutorialStatus';
import { TutorialSchoolSchedule,
	LoginNavigator,
	TutorialSchoolScheduleSelectPicture,
	DashboardSchoolScheduleSelectPicture,
	TutorialSchoolScheduleTakePicture,
	DashboardSchoolScheduleTakePicture,
	TutorialFixedEvent,
	TutorialAddCourse,
	DashboardAddCourse } from '../../constants/screenNames';

const fixedContainerHeight = Dimensions.get('window').height - StatusBar.currentHeight - Header.HEIGHT;

/**
 * Permits the user to import their school schedule by selecting or taking a picture or by manual import.
 */
class SchoolSchedule extends React.Component {

	static navigationOptions = ({navigation}) => {
		return {
			title: 'Add School Schedule',
			headerTintColor: white,
			headerTitleStyle: {fontFamily: 'Raleway-Regular'},
			headerTransparent: true,
			headerStyle: {
				backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
					color={white}
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

	goBack = () => {
		googleSignOut();
		this.props.navigation.navigate(LoginNavigator);
	}

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
	 * To go to the appropriate Add Course screen according to the current route*/
	manualImport() {
		if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
			this.props.navigation.navigate(TutorialAddCourse);
		} else {
			this.props.navigation.navigate(DashboardAddCourse);
		}
	}

	/** 
	 * To go to the next screen without entering any information*/
	skip = () => {
		this.props.navigation.navigate(TutorialFixedEvent, {update:false});
	}

	render() {
		const {containerHeight} = this.state;
		let tutorialStatus;

		if (this.props.navigation.state.routeName === TutorialSchoolSchedule) {
			tutorialStatus = <TutorialStatus active={1}
				color={white}
				skip={this.skip} />;
		} else {
			tutorialStatus = null;
		}

		return (
			<LinearGradient style={styles.container}
				colors={gradientColors}>
				<ImageBackground style={styles.container}
					source={require('../../assets/img/loginScreen/backPattern.png')} 
					resizeMode="repeat">
					<StatusBar translucent={true}
						backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<View style={[styles.content, {height:containerHeight}]}
						onLayout={(event) => {
							let height = event.nativeEvent.layout;
							if (height < fixedContainerHeight) {
								this.setState({fixedContainerHeight});
							}
						}}>
						<View style={styles.instruction}>
							<FontAwesome5 name="university"
								size={130}
								color={white}/>
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

						{tutorialStatus}
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default SchoolSchedule;