import React from 'react';
import { Alert, StatusBar, Text, View, BackHandler, Platform, ImageStore } from 'react-native';
import { Surface } from 'react-native-paper';
import { HeaderBackButton } from 'react-navigation';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { DashboardNavigator, ReviewEventRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { analyzePicture } from '../../services/service';
import { schoolScheduleCreationStyles as styles, dark_blue, white } from '../../styles';

/**
 * The loading screen after the User uploads a picture
 * Displays 'Analyzing picture' with a progress bar.
 */
class SchoolScheduleCreation extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			alertDialog: false,
			goToNextScreen: false
		};
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	static navigationOptions = ({ navigation }) => ({
		gesturesEnabled: false,
		headerLeft: <HeaderBackButton title='Back' tintColor={white} onPress={() => {
			navigation.getParam('onBackPress')(); 
		}} />,
	});
	
	componentWillMount() {	
		if (this.props.hasImage) {
			ImageStore.getBase64ForTag(this.props.imgURI, this.success, this.error);
		}

		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.props.navigation.setParams({onBackPress:  this.handleBackButton});
	}

	success = (base64String) => {
		base64String = base64String.toString();
		let fakeEscape = base64String.replace(/[+]/g,'PLUS');
		fakeEscape = fakeEscape.replace(/[=]/g,'EQUALS');
		analyzePicture({data: fakeEscape}).then(success => {
			if (success) {
				this.setState({goToNextScreen: true});
				this.nextScreen();
			} else {
				this.props.navigation.pop();
			}
		});
	}

	nextScreen = () => {
		if (this.state.goToNextScreen && !this.state.alertDialog) {
			let routes = this.props.navigation.dangerouslyGetParent().state.routes;

			if (routes && routes[routes.length - 4].routeName == ReviewEventRoute) {
				this.props.navigation.navigate(ReviewEventRoute);
			} else {
				this.props.navigation.navigate(DashboardNavigator);
			}
		}
	}

	error = (err) => {
		console.log('error', err);
	}

	handleBackButton = () => {
		this.setState({alertDialog: true});
		Alert.alert(
			'Stopping extraction',
			'The schedule analyzing process will be stop if you proceed, where do you want to go?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
					onPress: () => {
						this.setState({alertDialog: false});
						this.nextScreen();
					}
				},
				{
					text: 'Dashboard',
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
					}
				},
				{
					text: 'Review Events', 
					onPress: () => {
						this.props.navigation.navigate(ReviewEventRoute);
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
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
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
			</View>
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