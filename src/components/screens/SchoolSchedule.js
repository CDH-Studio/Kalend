import React from 'react';
import { connect } from 'react-redux';
import { ImageBackground, StatusBar, StyleSheet, View, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { analyzePicture, InsertDataIntoGoogle } from '../../services/service';
import LinearGradient from 'react-native-linear-gradient';

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

	componentDidMount() {
		//let data = grabUserData();
		let data = analyzePicture();
		InsertDataIntoGoogle(data);
	}

	render() {
		return (
			<LinearGradient style={styles.container} colors={['#1473E6', '#0E55AA']}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<View style={styles.content}>
						<View style={styles.instruction}>
							<Image style={styles.schoolIcon} source={require('../../assets/img/schoolSchedule/school.png')} resizeMode="contain" />
							<Text style={styles.text}>Import your school schedule by importing or taking a picture</Text>
						</View>
						
						<View style={styles.button}>
							<TouchableOpacity style={styles.buttonSelect} onPress={() => this.props.navigation.navigate('SchoolScheduleSelectPicture')}>
								<Text style={styles.buttonSelectText}>SELECT A PICTURE</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.buttonTake} onPress={() => this.props.navigation.navigate('SchoolScheduleTakePicture')}>
								<Text style={styles.buttonTakeText}>TAKE A PICTURE</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.section}>
							<View style={styles.emptySection}>
								<Text style={styles.skipButtonText}>Skip</Text>
							</View>
							<View style={styles.sectionIconRow}>
								<Image style={styles.sectionIcon} source={require('../../assets/img/schoolSchedule/sectionActive.png')} resizeMode="contain" />
								<Image style={styles.sectionIcon} source={require('../../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
								<Image style={styles.sectionIcon} source={require('../../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
								<Image style={styles.sectionIcon} source={require('../../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
								<Image style={styles.sectionIcon} source={require('../../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
							</View>
							
							<View style={styles.skipButton}>
								<TouchableOpacity onPress={() => this.props.navigation.navigate('FixedEvent')}>
									<Text style={styles.skipButtonText}>Skip</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

function mapStateToProps(state) {
	const { user } =  state.HomeReducer.profile;
	console.log('user', user);
	return user;
}
export default connect(mapStateToProps, null)(SchoolSchedule);

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
		marginTop: 160
	},

	schoolIcon: {
		height: 130,
		width: 130
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center'
	},

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
		paddingTop: 30,
		paddingLeft: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20,
		width: 220
	},

	button: {
		alignItems: 'center'
	},

	buttonSelect: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		padding: 17,
		alignItems: 'center',
		width: 300,
		borderWidth: 3,
		borderColor: '#FFFFFF',
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

	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 50,
		marginBottom: 10
	},

	emptySection: {
		marginLeft: 20,
		opacity: 0
	},

	sectionIconRow: {
		flexDirection: 'row'
	},

	sectionIcon: {
		width: 20,
		height: 20,
		margin: 8
	},

	skipButton: {
		marginRight: 20,
		marginBottom: 2
	},

	skipButtonText: {
		color: 'white',
		fontFamily: 'Raleway-Regular',
		fontSize: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10
	}
});

