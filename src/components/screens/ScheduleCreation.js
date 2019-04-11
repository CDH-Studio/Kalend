import React from 'react';
import { StatusBar, BackHandler, Alert, Text, View, Platform } from 'react-native';
import * as Progress from 'react-native-progress';
import { Surface } from 'react-native-paper';
import { HeaderBackButton } from 'react-navigation';
import { generateCalendars, setUserInfo, insertFixedEventsToGoogle } from '../../services/service';
import { connect } from 'react-redux';
import { DashboardNavigator, ScheduleSelectionRoute, ReviewEventRoute } from '../../constants/screenNames';
import { scheduleCreateStyles as styles, dark_blue, white } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { getStrings } from '../../services/helper';

/**
 * The loading screen shown after the user reviewed their events
 */
class ScheduleCreation extends React.PureComponent {

	strings = getStrings().ScheduleCreation;

	// Removes the header
	static navigationOptions = ({ navigation }) => ({
		gesturesEnabled: false,
		headerLeft: <HeaderBackButton title='Back' tintColor={white} onPress={() => {
			navigation.getParam('onBackPress')(); 
		}} />,
	});

	constructor(props) {
		super(props);

		this.state = {
			alertDialog: false,
			goToNextScreen: false
		};

		updateNavigation('ScheduleCreation', props.navigation.state.routeName);
	}

	componentWillMount() {
		// Adds a little delay before going to the next screen
		setUserInfo();
		insertFixedEventsToGoogle()
			.then(() => {
				if (this.props.NonFixedEventsReducer.length != 0) {
					setTimeout(() =>{ 
						this.generateScheduleService();
					}, 3000);
				} else  {
					this.setState({goToNextScreen: true});
					this.navigateToSelection();
				}
			})
			.catch(err => {
				if (err) {
					Alert.alert(
						this.strings.error,
						err,
						[
							{text: this.strings.ok, onPress: () => this.props.navigation.pop()},
						],
						{cancelable: false}
					);
				}
			});
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.props.navigation.setParams({onBackPress:  this.handleBackButton});
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
						this.navigateToSelection();
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

	generateScheduleService = () => {
		generateCalendars().then(() => {
			this.setState({goToNextScreen: true});
			this.navigateToSelection();
		});
	}

	/**
	 * Goes to the next screen
	 */
	navigateToSelection = () => {
		if (this.state.goToNextScreen && !this.state.alertDialog) {
			this.props.navigation.navigate(ScheduleSelectionRoute, {title: getStrings().ScheduleSelection.title});
		}
	}
	
	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'rgba(0,0,0,0.5)'} />

				<Surface style={styles.surface}>
					<Text style={styles.title}>{this.strings.dialogTitle}</Text>

					<Text style={styles.subtitle}>{this.strings.dialogDescription}</Text>

					<Progress.Bar style={styles.progressBar} 
						indeterminate={true} 
						width={200} 
						color={dark_blue} 
						useNativeDriver={true} 
						borderColor={dark_blue} 
						unfilledColor={'#79A7D2'}/>
				</Surface>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const {FixedEventsReducer, CoursesReducer, NonFixedEventsReducer, GeneratedNonFixedEventsReducer} = state;
	
	return {
		FixedEventsReducer,
		CoursesReducer,
		NonFixedEventsReducer,
		GeneratedNonFixedEventsReducer
	};
};

export default connect(mapStateToProps, null)(ScheduleCreation);