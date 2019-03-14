import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import ImgToBase64 from 'react-native-image-base64';
import * as Progress from 'react-native-progress';
import { NavigationActions } from 'react-navigation';
import { ImageBackground, Alert, StatusBar, Platform, StyleSheet, Dimensions, Text, BackHandler } from 'react-native';
import updateNavigation from '../NavigationHelper';
import { analyzePicture } from '../../services/service';
import { gradientColors } from '../../../config';
import { white, orange, lightOrange } from '../../styles';
import { DashboardNavigator } from '../../constants/screenNames';

/**
 * The loading screen after the User uploads a picture
 * Displays 'Analyzing picture' with a progress bar.
 */
class SchoolScheduleCreation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0
		};
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	static navigationOptions = {
		header: null,
		headerLeft: null,
		gesturesEnabled: false,
	};
	
	componentWillMount() {	
		if (this.props.hasImage) {
			ImgToBase64.getBase64String(this.props.imgURI)
				.then(base64String => {
					base64String = base64String.toString();
					let fakeEscape = base64String.replace(/[+]/g,'PLUS');
					fakeEscape = fakeEscape.replace(/[=]/g,'EQUALS');
					analyzePicture({data: fakeEscape}).then(success => {
						if (success) this.props.navigation.navigate(DashboardNavigator);
						else this.props.navigation.pop();
					});
				})
				.catch(err => console.log('error', err));
		}

		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}


	handleBackButton = () => {
		Alert.alert(
			'Are you sure you want to stop the schedule analyzing process?',
			[
				{
					text: 'No',
					style: 'cancel',
				},
				{text: 'Yes', 
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
					},
				},
			],
			{cancelable: false},
		);
		return true;
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	render() {
		return(
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} 
					source={require('../../assets/img/loginScreen/backPattern.png')} 
					resizeMode="repeat" >
					<StatusBar translucent={true} 
						backgroundColor={'rgba(0, 0, 0, 0.4)'} />
					<Surface style={styles.surface}>
						<Text style={styles.title}>Analysing your Picture</Text>
						<Text style={styles.subtitle}>Extracting the information from your picture</Text>
						<Progress.Bar style={{alignSelf:'center'}} 
							indeterminate={true} 
							width={200} 
							color={orange} 
							useNativeDriver={true} 
							unfilledColor={lightOrange} />
					</Surface>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		imgURI: state.ImageReducer.data,
		hasImage: state.ImageReducer.hasImage
	};
};

export default connect(mapStateToProps, null)(SchoolScheduleCreation);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	surface: {
		padding: 8,
		height: 100,
		width: Dimensions.get('window').width * 0.8,
		borderRadius: 4,
		justifyContent: 'center',
		elevation: 3,
	},

	title: {
		fontSize: 20,
		fontFamily: 'Raleway-Regular',
		textAlign: 'center'
	},

	subtitle: {
		fontFamily: 'Raleway-Regular',
		textAlign: 'center',
		paddingTop: 5,
		paddingBottom: 10
	}
});