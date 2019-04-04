import React from 'react';
import { StatusBar, View, Text, Platform, TextInput, Switch, Picker, ActionSheetIOS, Dimensions, KeyboardAvoidingView, ScrollView, findNodeHandle } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Feather from 'react-native-vector-icons/Feather';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { updateFixedEvents, addFixedEvent } from '../../actions';
import BottomButtons from '../BottomButtons';
import { FixedEventRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { timeVerification, dateVerification } from '../../services/helper';
import { fixedEventStyles as styles, blue, dark_blue, statusBlueColor, white } from '../../styles';

const moment = require('moment');

const viewHeight = 515.1428833007812;
const containerWidth = Dimensions.get('window').width;

/**
 * Permits the user to add their fixed events such as meetings and appointments.
 */
class FixedEvent extends React.PureComponent {

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.routeName === FixedEventRoute ? 'Add Fixed Events' : 'Edit Fixed Event',
		headerStyle: {
			backgroundColor: white
		}
	});

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		this.state = {
			containerHeight,

			title: '',
			titleValidated: true,

			allDay: false,

			startDate: moment().format('ddd., MMM DD, YYYY'),
			endDate: moment().format('ddd., MMM DD, YYYY'),

			startTime: moment().format('h:mm A'),
			endTime: moment().format('h:mm A'),

			location: '',
			recurrenceValue: 'None',
			recurrence: 'NONE',
			description: '',

			showTutShadow: true,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
		};
		updateNavigation('FixedEvent', props.navigation.state.routeName);
	}

	componentWillMount() {
		if(this.props.navigation.state.routeName === FixedEventRoute) {
			this.resetField();
		} else {
			this.setState({...this.props.FEditState});
		}
		this.setContainerHeight();
	}

	//TODO: Do we need it?
	setContainerHeight = () => {
		let statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT - statusBarHeight;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		// Causes a bug (cannot scroll when keyboard is shown)
		// let scrollable = containerHeight !== containerHeightTemp;
		let showTutShadow = containerHeight !== containerHeightTemp;

		this.setState({
			containerHeight,
			showTutShadow
		});
	}

	/**
	 * Checks if its the same dates after a date change and set the times if needed
	 */
	dateTimeStateVerification() {
		if (moment(this.state.startDate, 'ddd., MMM DD, YYYY').isSame(moment(this.state.endDate, 'ddd., MMM DD, YYYY'))) {
			if (moment(this.state.endTime, 'h:mm A').isAfter(moment(this.state.startTime, 'h:mm A'))) {
				//do nothing
			} else {
				this.setState({endTime: this.state.startTime});
			}
		} else {
			//do nothing
		}
	}

	/**
	 * Analyzes the input times and make sure the ranges make sense
	 * 
	 * @param {String} time The time of the unchanged value
	 */
	dateTimeVerification(time) {
		if (moment(this.state.startDate, 'ddd., MMM DD, YYYY').isSame(moment(this.state.endDate, 'ddd., MMM DD, YYYY'))) {
			return timeVerification(this.state.startTime, this.state.endTime, time);
		} else {
			return time;
		}
	}

	/**
	 * Opens up the iOS action sheet to set the recurrence
	 */
	recurrenceOnClick = () => {
		return ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['None', 'Everyday', 'Weekly', 'Monthly', 'Cancel'],
				cancelButtonIndex: 4,
				tintColor: blue
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this.setState({recurrenceValue: 'NONE'});
				} else if (buttonIndex === 1) {
					this.setState({recurrenceValue: 'DAILY'});
				} else if (buttonIndex === 2) {
					this.setState({recurrenceValue: 'WEEKLY'});
				} else if (buttonIndex === 3) {
					this.setState({recurrenceValue: 'MONTHLY'});
				}
			},
		);
	}


	/**
	 * To go to the next screen without entering any information
	 */
	skip = () => {
		this.props.navigation.pop();
	}

	/**
	 * Validates the Title, End Date and End Time fields
	 */
	fieldValidation = () => {
		let validated = true;

		if (this.state.title === '') {
			this.setState({titleValidated: false});
			validated = false;
		} else {
			this.setState({titleValidated: true});
		}

		return validated;
	}

	/**
	 * Adds the event in the calendar
	 */
	nextScreen = () => {
		if (!this.fieldValidation()) {
			return;
		}

		if (this.props.navigation.state.routeName !== FixedEventRoute) {
			this.props.dispatch(updateFixedEvents(this.props.selectedIndex, this.state));
		} else {
			this.props.dispatch(addFixedEvent(this.state));
		}

		this.props.navigation.pop();
	}

	/**
	 * Adds the event to the calendar and resets the fields
	 */
	addAnotherEvent = () => {
		if (!this.fieldValidation()) {
			this.setState({
				snackbarText: 'Invalid fields, please review to add event',
				snackbarVisible: true,
				snackbarTime: 5000
			});
			return false;
		}

		this.props.dispatch(addFixedEvent(this.state));
		this.setState(this.resetField());
		this.refs._scrollView.scrollTo({x: 0});
		this.setState({
			snackbarText: 'Event successfully added',
			snackbarVisible: true,
			snackbarTime: 3000
		});
	}

	/**
	 * Reset the fields of the form
	 */
	resetField = () => {
		this.setState({
			title: '',
			titleValidated: true,

			allDay: false,

			startDate:  moment().format('ddd., MMM DD, YYYY'),
			endDate:  moment().format('ddd., MMM DD, YYYY'),

			startTime: moment().format('h:mm A'),
			endTime: moment().format('h:mm A'),

			location: '',
			recurrenceValue: 'None',
			recurrence: 'NONE',
			description: '',

			showTutShadow: true,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
		});
	}

	//TODO: Comment function
	scrollToInput = (inputFieldRef, keyboardScrollHeight) => {
		const scrollResponder = this.refs._scrollView.getScrollResponder();
		const inputHandle = findNodeHandle(inputFieldRef);

		scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
			inputHandle,
			keyboardScrollHeight,
			true
		);
	}

	render() {
		const { containerHeight, snackbarVisible, snackbarText, snackbarTime } = this.state;
		
		let addEventButtonText;
		let addEventButtonFunction;
		let errorTitle;
		let showNextButton = true;

		if (!this.state.titleValidated) {
			errorTitle = <Text style={styles.errorTitle}>Title cannot be empty.</Text>;
		} else {
			errorTitle = null;
		}

		/**
		 * In order to show components based on current route
		 */
		if (this.props.navigation.state.routeName === FixedEventRoute) {
			addEventButtonText = 'Add';
			addEventButtonFunction = this.addAnotherEvent;
		} else {
			addEventButtonText = 'Done';
			addEventButtonFunction = this.nextScreen;
			showNextButton = false;
		}
		
		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<KeyboardAvoidingView 
					behavior={Platform.OS === 'ios' ? 'padding' : null}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
					<ScrollView ref='_scrollView'
						scrollEventThrottle={100}>
						<View style={[styles.content, {height: containerHeight}]}>
							<View style={styles.instruction}>
								<Text style={styles.text}>Add your events, office hours, appointments, etc.</Text>
								
								<MaterialCommunityIcons name="calendar-today"
									size={130}
									color={dark_blue}/>
							</View>

							<View>
								<View style={styles.textInput}>
									<MaterialCommunityIcons name="format-title"
										size={30}
										color={blue} />

									<View style={[styles.textInputBorder, {borderBottomColor: !this.state.titleValidated ? '#ff0000' : '#D4D4D4'}]}>
										<TextInput style={styles.textInputText}
											maxLength={1024}
											placeholder="Title" 
											returnKeyType = {'next'}
											onSubmitEditing={() => this.refs.locationInput.focus()}
											blurOnSubmit={false}
											onChangeText={(title) => this.setState({title, titleValidated: true})}
											value={this.state.title}/>
									</View>
								</View>

								{errorTitle}
							</View>

							<View style={styles.timeSection}>
								<View style={[styles.allDay, {width: containerWidth}]}>
									<Text style={styles.blueTitle}>All-Day</Text>
									<View style={styles.switch}>
										<Switch trackColor={{false: 'lightgray', true: blue}} 
											ios_backgroundColor={'lightgray'} 
											thumbColor={(this.state.allDay && Platform.OS !== 'ios') ? dark_blue : null} 
											onValueChange={(allDay) => this.setState({allDay: allDay})} 
											value = {this.state.allDay} />
									</View>
								</View>

								<View style={[styles.rowTimeSection, {width: containerWidth}]}>
									<Text style={styles.blueTitle}>Start</Text>
									<DatePicker showIcon={false} 
										date={this.state.startDate} 
										mode="date" 
										style={{width:140}}
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular'}
										}}
										format="ddd., MMM DD, YYYY"
										onDateChange={(startDate) => {
											this.setState({startDate});
											this.setState({endDate: dateVerification(this.state.startDate, this.state.endDate, this.state.endDate)});
											this.dateTimeStateVerification();
										}} />
										
									<DatePicker showIcon={false} 
										date={this.state.startTime} 
										mode="time"
										disabled={this.state.allDay}
										style={{width:70}}
										customStyles={{
											dateInput:{borderWidth: 0},
											disabled:{opacity: 0},
											dateText:{fontFamily: 'OpenSans-Regular'} 
										}}
										format="h:mm A" 
										locale={'US'}
										is24Hour={false}
										onDateChange={(startTime) => {
											this.setState({startTime});
											this.setState({endTime: this.dateTimeVerification(this.state.endTime)});
										}} />
								</View>

								<View style={[styles.rowTimeSection, {width: containerWidth}]}>
									<Text style={styles.blueTitle}>End</Text>
									<DatePicker showIcon={false} 
										date={this.state.endDate} 
										mode="date" 
										style={{width:140}}
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{fontFamily: 'OpenSans-Regular'}
										}}
										format="ddd., MMM DD, YYYY"
										onDateChange={(endDate) => {
											this.setState({endDate});
											this.setState({startDate: dateVerification(this.state.startDate, this.state.endDate, this.state.startDate)});
											this.dateTimeStateVerification();
										}} />

									<DatePicker showIcon={false} 
										date={this.state.endTime} 
										mode="time"
										disabled={this.state.allDay}
										style={{width:70}}
										customStyles={{
											dateInput:{borderWidth: 0}, 
											disabled:{opacity: 0},
											dateText:{fontFamily: 'OpenSans-Regular'}
										}}
										format="h:mm A"
										locale={'US'}
										is24Hour={false}
										onDateChange={(endTime) => {
											this.setState({endTime});
											this.setState({startTime: this.dateTimeVerification(this.state.startTime)});
										}} />
								</View>
							</View>

							<View style={styles.description}>
								<View style={styles.textInput}>
									<MaterialIcons name="location-on"
										size={30}
										color={blue} />

									<View style={styles.textInputBorder}>
										<TextInput style={styles.textInputText} 
											onFocus={() => this.scrollToInput(this.refs.locationInput, 200)}
											maxLength={1024}
											placeholder="Location" 
											ref='locationInput'
											returnKeyType = {'next'}
											onSubmitEditing={() =>  this.refs.descriptionInput.focus()}
											blurOnSubmit={false}
											onChangeText={(location) => this.setState({location})} 
											value={this.state.location}/>
									</View>
								</View>

								<View style={styles.textInput}>
									<MaterialCommunityIcons name="text-short"
										size={30}
										color={blue} />

									<View style={styles.textInputBorder}>
										<TextInput style={styles.textInputText} 
											maxLength={1024}
											onFocus={() => this.scrollToInput(this.refs.descriptionInput, 300)}
											placeholder="Description" 
											ref='descriptionInput'
											returnKeyType = {'done'}
											onChangeText={(description) => this.setState({description})} 
											value={this.state.description}/>
									</View>
								</View>

								<View style={styles.textInput}>
									<Feather name="repeat"
										size={30}
										color={blue} />

									<View style={styles.textInputBorder}>
										{
											Platform.OS === 'ios' ? 
												<View>
													<MaterialIcons name="arrow-drop-down"
														size={20}
														style={{position: 'absolute', right: 0}} />
													<Text style={{padding: 1}} 
														onPress={this.recurrenceOnClick}>
														{this.state.recurrenceValue.charAt(0).toUpperCase() + this.state.recurrenceValue.slice(1).toLowerCase()}
													</Text>
												</View>
												:	
												<Picker style={styles.recurrence} 
													selectedValue={this.state.recurrence} 
													onValueChange={(recurrenceValue) => this.setState({recurrence: recurrenceValue})}>
													<Picker.Item label="None" value="NONE" />
													<Picker.Item label="Everyday" value="DAILY" />
													<Picker.Item label="Weekly" value="WEEKLY" />
													<Picker.Item label="Monthly" value="MONTHLY" />
												</Picker>

										}
									</View>
								</View>
							</View>

							<BottomButtons twoButtons={showNextButton}
								buttonText={[addEventButtonText, 'Done']}
								buttonMethods={[addEventButtonFunction, this.skip]} />
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => this.setState({ snackbarVisible: false })} 
					style={styles.snackbar}
					duration={snackbarTime}>
					{snackbarText}
				</Snackbar>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { FixedEventsReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		FEditState: FixedEventsReducer[selected],
		FixedEventsReducer,
		selectedIndex: NavigationReducer.reviewEventSelected
	};
};

export default connect(mapStateToProps, null)(FixedEvent);