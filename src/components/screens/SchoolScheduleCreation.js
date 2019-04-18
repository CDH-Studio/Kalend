import React from 'react';
import { Alert, StatusBar, Text, View, BackHandler, Platform } from 'react-native';
import { Surface } from 'react-native-paper';
import { HeaderBackButton, NavigationActions } from 'react-navigation';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { DashboardNavigator, ReviewEventRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { analyzePicture, storeCoursesEvents } from '../../services/service';
import { getStrings } from '../../services/helper';
import { schoolScheduleCreationStyles as styles, dark_blue, white } from '../../styles';
import RNFetchBlob from 'rn-fetch-blob';

/**
 * The loading screen after the User uploads a picture
 * Displays 'Analyzing picture' with a progress bar.
 */
class SchoolScheduleCreation extends React.PureComponent {

	strings = getStrings().SchoolScheduleCreation;

	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			alertDialog: false,
			goToNextScreen: false
		};
		
		updateNavigation('SchoolScheduleCreation', props.navigation.state.routeName);
	}

	navigateAction = NavigationActions.navigate({
		action: 'FinishSchoolCreation'
	})

	static navigationOptions = ({ navigation }) => ({
		gesturesEnabled: false,
		headerLeft: <HeaderBackButton title='Back' tintColor={white} onPress={() => {
			navigation.getParam('onBackPress')(); 
		}} />,
	});
	
	componentWillMount() {	
		if (this.props.hasImage) {
			let uri = this.props.imgURI;

			// Related to this issue https://github.com/facebook/react-native/issues/24185
			if (Platform.OS === 'ios') {
				const appleId = uri.substring(5, 41);
				const ext = 'JPG';
				uri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
			}
			
			RNFetchBlob.fs.readFile(uri, 'base64')
				.then(data => {
					if (data != undefined) {
						this.success(data);
					} else {
						this.error(this.strings.fileNoData);
					}
				})
				.catch(this.error);
		}

		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.props.navigation.setParams({onBackPress:  this.handleBackButton});
	}

	success = (base64String) => {
		base64String = base64String.toString();
		let fakeEscape = base64String.replace(/[+]/g,'PLUS');
		fakeEscape = fakeEscape.replace(/[=]/g,'EQUALS');
		analyzePicture({data: fakeEscape})
			.then(data => {
				this.setState({goToNextScreen: true, data});
				this.nextScreen();
			})
			.catch(err => {
				if (err) {
					Alert.alert(
						this.strings.error,
						err,
						[
							{text: 'Ok', onPress: () => this.props.navigation.pop()},
						],
						{cancelable: false}
					);
				} 
			});
	}

	nextScreen = () => {
		if (this.state.goToNextScreen && !this.state.alertDialog) {
			let routes = this.props.navigation.dangerouslyGetParent().state.routes;

			if (this.state.data != undefined) {
				storeCoursesEvents(this.state.data)
					.then((success) => {
						if (!success) {
							Alert.alert(
								'Error',
								'Trouble converting the parsed data from the schedule to Google Calendar',
								[
									{text: 'OK', onPress: () => this.props.navigation.pop()},
								],
								{cancelable: false}
							);
						}
					});
			}

			if (routes && routes[routes.length - 4].routeName == ReviewEventRoute) {
				this.props.navigation.navigate(ReviewEventRoute, {title: getStrings().ReviewEvent.title});
			} else {
				this.props.navigation.dispatch(this.navigateAction);
			}
		}
	}

	error = (err) => {
		console.log('error', err);
	}

	handleBackButton = () => {
		this.setState({alertDialog: true});
		Alert.alert(
			this.strings.backAlertTitle,
			this.strings.backAlertDescription,
			[
				{
					text: this.strings.cancel,
					style: 'cancel',
					onPress: () => {
						this.setState({alertDialog: false});
						this.nextScreen();
					}
				},
				{
					text: getStrings().Dashboard.name,
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
					}
				},
				{
					text: getStrings().ReviewEvent.name, 
					onPress: () => {
						this.props.navigation.navigate(ReviewEventRoute, {title: getStrings().ReviewEvent.title});
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
					<Text style={styles.title}>{this.strings.dialogTitle}</Text>

					<Text style={styles.subtitle}>{this.strings.dialogDescription}</Text>
					
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