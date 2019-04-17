import React from 'react';
import { StatusBar, View, ScrollView, Text, Switch, Dimensions, TextInput, Platform, KeyboardAvoidingView, findNodeHandle } from 'react-native';
import Slider from '@react-native-community/slider';
import DatePicker from 'react-native-datepicker';
import NumericInput from 'react-native-numeric-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar, RadioButton } from 'react-native-paper';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { updateNonFixedEvents, addNonFixedEvent } from '../../actions';
import BottomButtons from '../BottomButtons';
import { ReviewEventRoute, NonFixedEventRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { dateVerification, getStrings } from '../../services/helper';
import { nonFixedEventStyles as styles, white, blue, gray, dark_blue, statusBlueColor } from '../../styles';

const moment = require('moment');
const viewHeight = 843.4285888671875;

/**
 * Permits the user to add Non-Fixed events i.e. events that can be moved around in the calendar
 */
class NonFixedEvent extends React.PureComponent {

	strings = getStrings().NonFixedEvent;
	buttonStrings = getStrings().BottomButtons;

	static navigationOptions = ({navigation}) => ({
		title: navigation.state.routeName === NonFixedEventRoute ? navigation.state.params.addTitle : navigation.state.params.editTitle,
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

			specificDateRange: false,
			startDate: moment().format('ddd., MMM DD, YYYY'),
			endDate: moment().format('ddd., MMM DD, YYYY'),

			hours: 0,
			minutes: 0,
			durationValidated: true,
			isDividable: false,
			occurrence: 1,
			isRecurrent: false,

			priority: 0.5,
			location: '',
			description: '',

			showTutShadow: true,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000
		};
		
		updateNavigation('NonFixedEvent', props.navigation.state.routeName);
	}
	
	componentWillMount() {	
		if (this.props.navigation.state.routeName !== NonFixedEventRoute) {
			this.setState({...this.props.NFEditState});
		} else  {
			this.resetFields();
		}
	}

	/**
	 * To go to the next screen without entering any information
	 */
	skip = () => {
		this.props.navigation.pop();
	}

	/**
	 * Validates the Title and Duration fields
	 */
	fieldValidation = () => {
		let validated = true;

		if (this.state.title === '') {
			this.setState({titleValidated: false});
			validated = false;
		} else {
			this.setState({titleValidated: true});
		}
		
		if (this.state.hours === 0 && this.state.minutes === 0) {
			this.setState({durationValidated: false});
			validated = false;
		} else {
			this.setState({durationValidated: true});
		}

		return validated;
	}

	/**
	 * Adds the event in the database
	 */
	nextScreen = () => {
		if (!this.fieldValidation()) {
			return;
		}

		if (this.props.navigation.state.routeName === NonFixedEventRoute) {
			this.props.dispatch(addNonFixedEvent(this.state));
			this.props.navigation.navigate(ReviewEventRoute,  {title: getStrings().ReviewEvent.title});
		} else {
			this.props.dispatch(updateNonFixedEvents(this.props.selectedIndex, this.state));
			this.props.navigation.navigate(ReviewEventRoute, {title: getStrings().ReviewEvent.title, changed:true});
		}
	}

	/**
	 * Adds the event to the database and resets the fields
	 */
	addAnotherEvent = () => {
		if (!this.fieldValidation()) {
			this.setState({
				snackbarText: this.strings.snackbarFailure,
				snackbarVisible: true,
				snackbarTime: 5000
			});
			return;
		}

		this.props.dispatch(addNonFixedEvent(this.state));
		this.resetFields();
		this.refs._scrollView.scrollTo({x: 0});
		this.setState({
			snackbarText: this.strings.snackbarSuccess,
			snackbarVisible: true,
			snackbarTime: 3000
		});
	}

	/**
	 * Reset the fields of the form
	 */
	resetFields = () => {
		this.setState({
			title: '',
			titleValidated: true,

			specificDateRange: false,
			startDate: new Date().toDateString(),
			endDate: new Date().toDateString(),

			hours: 0,
			minutes: 0,
			durationValidated: true,
			isDividable: false,
			occurrence: 1,
			isRecurrent: false,

			priority: 0.5,
			location: '',
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
		let errorDuration;
		let showNextButton = true;

		if (!this.state.titleValidated) {
			errorTitle = <Text style={styles.errorTitle}>{this.strings.titleEmpty}</Text>;
		} else {
			errorTitle = null;
		}

		if (!this.state.durationValidated) {
			errorDuration = <Text style={styles.errorDuration}>{this.strings.durationEmpty}</Text>;
		} else {
			errorDuration = null;
		}

		/**
		 * In order to show components based on current route
		 */
		if (this.props.navigation.state.routeName === NonFixedEventRoute) {
			addEventButtonText = this.buttonStrings.add;
			addEventButtonFunction = this.addAnotherEvent;
		} else {
			addEventButtonText = this.buttonStrings.done;
			addEventButtonFunction = this.nextScreen;
			showNextButton = false;
		}

		return(
			<View style={styles.container}>
				<StatusBar backgroundColor={statusBlueColor} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

				<KeyboardAvoidingView 
					behavior={Platform.OS === 'ios' ? 'padding' : null}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
					<ScrollView ref='_scrollView'
						scrollEventThrottle={100}>
						<View style={[styles.content, {height: containerHeight}]}>
							<View style={styles.instruction}>
								<MaterialCommunityIcons name="face"
									size={130}
									color={dark_blue} />

								<Text style={styles.instructionText}>{this.strings.description}</Text>
							</View>

							<View>
								<View style={styles.textInput}>
									<MaterialCommunityIcons name="format-title"
										size={30}
										color={blue} />

									<View style={[styles.textInputBorder, {borderBottomColor: !this.state.titleValidated ? '#ff0000' : '#D4D4D4'}]}>
										<TextInput style={styles.textInputText} 
											maxLength={1024}
											placeholder={this.strings.titlePlaceholder} 
											returnKeyType = {'next'}
											onSubmitEditing={() => this.refs.locationInput.focus()}
											blurOnSubmit={false}
											onChangeText={(title) => this.setState({title, titleValidated: true})} 
											value={this.state.title}/>
									</View>
								</View>

								{errorTitle}
							</View>
						
							<View>
								<Text style={styles.sectionTitle}>{this.strings.availability}</Text>

								<View style={styles.timeSection}>
									<View style={styles.dateRange}>
										<Text style={styles.blueTitle}>{this.strings.dates}</Text>
										<View style={styles.dateRangeCol}>
											<RadioButton.Group
												onValueChange={(specificDateRange) => this.setState({specificDateRange: specificDateRange})}
												value={this.state.specificDateRange}>

												<View style={styles.date}>
													<Text style={styles.optionDate}>{this.strings.week}</Text>

													<RadioButton.Android value={false}
														uncheckedColor={'lightgray'}
														color={blue} />
												</View>

												<View style={styles.date}>
													<Text style={[styles.optionDate, {width: 200}]}>{this.strings.specificDate}</Text>

													<RadioButton.Android value={true}
														uncheckedColor={'lightgray'}
														color={blue} />
												</View>
											</RadioButton.Group>
										</View>
									</View>
								
								
									{this.state.specificDateRange ? /*To hide/show the date*/
										<View>
											<View style={styles.questionLayout}>
												<Text style={styles.blueTitle}>{this.strings.startDate}</Text>

												<DatePicker showIcon={false} 
													date={this.state.startDate} 
													mode="date" 
													style={{width:140}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{
															fontFamily: 'OpenSans-Regular'}
													}}
													format="ddd., MMM DD, YYYY"
													confirmBtnText={this.strings.confirmButton}
													cancelBtnText={this.strings.cancelButton}
													onDateChange={(startDate) => {
														this.setState({startDate,
															endDate: dateVerification(startDate, this.state.endDate, this.state.endDate)});
													}} />
											</View>
										
											<View style={styles.questionLayout}>
												<Text style={styles.blueTitle}>{this.strings.endDate}</Text>

												<DatePicker showIcon={false} 
													date={this.state.endDate} 
													mode="date" 
													style={{width:140}}
													customStyles={{
														dateInput:{borderWidth: 0},
														dateText:{fontFamily: 'OpenSans-Regular'}
													}}
													format="ddd., MMM DD, YYYY"
													confirmBtnText={this.strings.confirmButton}
													cancelBtnText={this.strings.cancelButton}
													onDateChange={(endDate) => {
														this.setState({endDate,
															startDate: dateVerification(this.state.startDate, endDate, this.state.startDate)});
													}} />
											</View>
										</View>: null}

									<View>
										<View style={styles.duration}>
											<Text style={[styles.blueTitle, {paddingTop: 14}]}>{this.strings.duration}</Text>

											<View style={styles.timePicker}>
												<NumericInput initValue = {this.state.hours}
													value={this.state.hours}
													onChange={(hours) => this.setState({hours, durationValidated: true})}
													minValue={0} 
													leftButtonBackgroundColor={blue}
													rightButtonBackgroundColor={blue}
													rounded={true}
													totalHeight={42}
													totalWidth={102}
													borderColor={'lightgray'}
													textColor={!this.state.durationValidated ? '#ff0000' : gray}
													iconStyle={{color: '#ffffff'}} />
												<Text style={styles.optionsText}>{this.strings.hours}</Text>
											</View>

											<View style={styles.timePicker}>
												<NumericInput initValue={this.state.minutes}
													value={this.state.minutes}
													onChange={(minutes) => this.setState({minutes, durationValidated: true})}
													minValue={0} 
													leftButtonBackgroundColor={blue}
													rightButtonBackgroundColor={blue}
													rounded={true}
													totalHeight={42}
													totalWidth={102}
													borderColor={'lightgray'}
													textColor={!this.state.durationValidated ? '#ff0000' : gray}
													iconStyle={{color: '#ffffff'}}  />
												<Text style={styles.optionsText}>{this.strings.minutes}</Text>
											</View>
										</View>

										{errorDuration}
									</View>

									<View style={styles.switch}>
										<Text style={[styles.blueTitle, {width:200}]}>{this.state.specificDateRange ? this.strings.splitDurationDate : this.strings.splitDurationWeek}</Text>

										<Switch trackColor={{false: 'lightgray', true: blue}}
											ios_backgroundColor={'lightgray'}
											thumbColor={(this.state.isDividable && Platform.OS !== 'ios') ? dark_blue : null}
											onValueChange={(isDividable) => this.setState({isDividable: isDividable})}
											value = {this.state.isDividable} />
									</View>

									<View style={styles.questionLayout}>
										<Text style={[styles.blueTitle, {width: 200}]}>{this.state.specificDateRange ? this.strings.numberTimeDate : this.strings.numberTimeWeek}</Text>

										<NumericInput initValue={this.state.occurrence}
											value={this.state.occurrence}
											onChange={(occurrence) => this.setState({occurrence})}
											minValue={1} 
											leftButtonBackgroundColor={blue}
											rightButtonBackgroundColor={blue}
											rounded={true}
											totalHeight={42}
											totalWidth={102}
											borderColor={'lightgray'}
											textColor={gray}
											iconStyle={{color: white}} />
									</View>
								
									{!this.state.specificDateRange ? 
										<View style={styles.switch}>
											<Text style={[styles.blueTitle, {width: 200}]}>{this.strings.everyWeek}</Text>

											<Switch trackColor={{false: 'lightgray', true: blue}}
												ios_backgroundColor={'lightgray'}
												thumbColor={(this.state.isRecurrent && Platform.OS !== 'ios') ? dark_blue : null}
												onValueChange={(isRecurrent) => this.setState({isRecurrent})}
												value = {this.state.isRecurrent} />
										</View> : null}
								</View>
							</View>

							<View>
								<Text style={styles.sectionTitle}>{this.strings.priorityLevel}</Text>

								<Slider value={this.state.priority}
									minimumValue={0}
									maximumValue={1} 
									step={0.5}
									thumbTintColor={dark_blue}
									minimumTrackTintColor={blue}
									onValueChange={(priority) => this.setState({priority: priority})} />

								<View style={styles.questionLayout}>
									<Text style={styles.optionsText}>{this.strings.low}</Text>

									<Text style={styles.optionsText}>{this.strings.normal}</Text>

									<Text style={styles.optionsText}>{this.strings.high}</Text>
								</View>
							</View>
							<View>
								<Text style={styles.sectionTitle}>{this.strings.details}</Text>

								<View style={styles.textInput}>
									<MaterialIcons name="location-on"
										size={30}
										color={blue} />

									<View style={styles.textInputBorder}>
										<TextInput style={styles.textInputText} 
											onFocus={() => this.scrollToInput(this.refs.locationInput, 200)}
											maxLength={1024}
											placeholder={this.strings.locationPlaceholder}
											ref="locationInput"
											returnKeyType = {'next'}
											onSubmitEditing={() => this.refs.descriptionInput.focus()}
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
											onFocus={() => this.scrollToInput(this.refs.locationInput, 300)}
											maxLength={1024}
											placeholder={this.strings.descriptionPlaceholder}
											ref="descriptionInput"
											returnKeyType = {'done'}
											onChangeText={(description) => this.setState({description})}
											value={this.state.description}/>
									</View>
								</View>
							</View>


							<BottomButtons twoButtons={showNextButton}
								buttonText={[addEventButtonText, this.buttonStrings.done]}
								buttonMethods={[addEventButtonFunction, this.skip]} />
						</View>
					</ScrollView>
				</KeyboardAvoidingView>

				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => this.setState({snackbarVisible: false})} 
					style={styles.snackbar}
					duration={snackbarTime}>
					{snackbarText}
				</Snackbar>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { NonFixedEventsReducer, NavigationReducer } = state;
	let selected = NavigationReducer.reviewEventSelected;

	return {
		NFEditState: NonFixedEventsReducer[selected],
		NonFixedEventsReducer,
		selectedIndex: NavigationReducer.reviewEventSelected
	};
};

export default connect(mapStateToProps, null)(NonFixedEvent);
