import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import ImgToBase64 from 'react-native-image-base64';
import * as Progress from 'react-native-progress';
import { NavigationActions } from 'react-navigation';
import { ImageBackground, StatusBar, Platform, Text } from 'react-native';
import updateNavigation from '../NavigationHelper';
import { analyzePicture } from '../../services/service';
import { gradientColors } from '../../../config';
import { schoolScheduleCreationStyles as styles, white, dark_blue } from '../../styles';

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

	navigateAction = NavigationActions.navigate({
		action: 'FinishSchoolCreation'
	})

	static navigationOptions = {
		title: 'Analysing Schedule',
		headerTintColor: white,
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};
	
	componentWillMount() {	
		if (this.props.hasImage) {
			ImgToBase64.getBase64String(this.props.imgURI)
				.then(base64String => {
					base64String = base64String.toString();
					let fakeEscape = base64String.replace(/[+]/g,'PLUS');
					fakeEscape = fakeEscape.replace(/[=]/g,'EQUALS');
					analyzePicture({data: fakeEscape}).then(success => {
						if (success) this.props.navigation.dispatch(this.navigateAction);
						else this.props.navigation.pop();
					});
				})
				.catch(err => console.log('error', err));
		}
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
							color={dark_blue} 
							useNativeDriver={true} 
							unfilledColor={'#79A7D2'} />
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