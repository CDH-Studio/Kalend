import React from 'react';
import { ImageBackground, StatusBar, View, Text, Platform, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Header } from 'react-navigation';
import { gradientColors } from '../../../config';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import { schoolScheduleStyles as styles, white } from '../../styles';
import { SchoolScheduleSelectPictureRoute, SchoolScheduleTakePictureRoute, CourseRoute } from '../../constants/screenNames';

const fixedContainerHeight = Dimensions.get('window').height - StatusBar.currentHeight - Header.HEIGHT;

/**
 * Permits the user to import their school schedule by selecting or taking a picture or by manual import.
 */
class SchoolSchedule extends React.Component {

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
	}

	selectAPicture() {
		if (Platform.OS !== 'ios') {
			requestStoragePermission().then((accepted) => {
				if (accepted) {
					this.props.navigation.navigate(SchoolScheduleSelectPictureRoute);
				}
			});
		} else {
			this.props.navigation.navigate(SchoolScheduleSelectPictureRoute);
		}
	}

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
	 * To go to the appropriate Add Course screen according to the current route*/
	manualImport() {
		this.props.navigation.navigate(CourseRoute);
	}

	render() {
		const {containerHeight} = this.state;

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
								color={white} style={styles.shadowIcon} />
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
				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default SchoolSchedule;