import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View, Text, Platform, TouchableOpacity, Dimensions } from 'react-native';
import {Header} from 'react-navigation';
import { gradientColors } from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import TutorialStatus from '../TutorialStatus';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import updateNavigation from '../NavigationHelper';

class SchoolSchedule extends React.Component {

	//Style for Navigation Bar
	static navigationOptions = {
		title: 'Add School Schedule',
		headerTintColor: 'white',
		headerTitleStyle: {fontFamily: 'Raleway-Regular'},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	//Constructor and States
	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
		};
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	//Methods
	selectAPicture() {
		if (Platform.OS !== 'ios') {
			requestStoragePermission().then((accepted) => {
				console.log(accepted);

				if (accepted) {
					this.props.navigation.navigate('SchoolScheduleSelectPicture');
				}
			});
		} else {
			this.props.navigation.navigate('SchoolScheduleSelectPicture');
		}
	}

	cameraCapture() {
		if (Platform.OS !== 'ios') {
			requestCamera().then((accepted) => {
				console.log(accepted);
				
				if (accepted) {
					this.props.navigation.navigate('SchoolScheduleTakePicture');
				}
			});
		} else {
			this.props.navigation.navigate('SchoolScheduleTakePicture');
		}
	} 

	skip = () => {
		this.props.navigation.navigate('TutorialFixedEvent');
	}

	//Render UI
	render() {
		const containerHeight = Dimensions.get('window').height - StatusBar.currentHeight - Header.HEIGHT;
		let tutorialStatus;

		if(this.props.navigation.state.routeName === 'TutorialSchoolSchedule') {
			tutorialStatus = <TutorialStatus active={1} color={'#ffffff'} skip={this.skip} />;
		} else {
			tutorialStatus = null;
		}

		return (
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<View style={{height:this.state.containerHeight, flex:1, justifyContent:'space-evenly'}} //Inline style in order for the height to work 
						onLayout={(event) => {
							let height = event.nativeEvent.layout;
							if(height < containerHeight) {
								this.setState({containerHeight});
							}
						}}>
						<View style={styles.instruction}>
							<FontAwesome5 name="university" size={130} color='#ffffff'/>
							<Text style={styles.text}>Import your school schedule by importing or taking a picture</Text>
						</View>
						
						<View style={styles.button}>
							<TouchableOpacity style={styles.buttonSelect} onPress={() => this.selectAPicture()}>
								<Text style={styles.buttonSelectText}>SELECT A PICTURE</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.buttonTake} onPress={() => this.cameraCapture()}>
								<Text style={styles.buttonTakeText}>TAKE A PICTURE</Text>
							</TouchableOpacity>
						</View>

						{tutorialStatus}
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default SchoolSchedule;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		paddingLeft: 15,
		width: 220
	},

	button: {
		alignItems: 'center',
		marginTop: -100
	},

	buttonSelect: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		padding: 17,
		paddingVertical: 21.15,
		alignItems: 'center',
		width: 300,
		elevation: 4
	},

	buttonSelectText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#1473E6',
		
	},

	buttonTake: {
		borderRadius: 12,
		backgroundColor: 'transparent',
		borderWidth: 3,
		borderColor: '#FFFFFF',
		padding: 17,
		alignItems: 'center',
		marginTop: 20,
		width: 300,
		elevation: 4
	},

	buttonTakeText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		fontWeight:'500',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20
	},
});

