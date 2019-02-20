import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { gradientColors } from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import { requestStoragePermission, requestCamera } from '../../services/android_permissions';
import TutorialStatus from '../TutorialStatus';

class SchoolSchedule extends React.Component {
	static navigationOptions = {
		title: 'Add School Schedule',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

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
		this.props.navigation.navigate('FixedEvent');
	}

	render() {
		return (
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<View style={styles.content}>
						<View style={styles.instruction}>
							<Image style={styles.schoolIcon} source={require('../../assets/img/schoolSchedule/school.png')} resizeMode="contain" />
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

						<TutorialStatus active={3} color={'#ffffff'} skip={this.skip} />
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

	content: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginTop: 160,
		paddingLeft: 35,
		paddingRight: 35
	},

	schoolIcon: {
		height: 130,
		width: 130
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
		alignItems: 'center'
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

