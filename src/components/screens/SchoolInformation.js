import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StatusBar, TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { schoolInformationStyles as styles, dark_blue, statusBlueColor, gray, white, red } from '../../styles';
import DatePicker from 'react-native-datepicker';
import { Header } from 'react-navigation';
import BottomButtons from '../BottomButtons';
import { setSchoolInformation } from '../../actions';
import { RadioButton } from 'react-native-paper';
import { SchoolScheduleRoute, CourseRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { ScrollView } from 'react-native-gesture-handler';

const viewHeight = 584;

class SchoolInformation extends React.PureComponent {
	static navigationOptions = {
		title: 'Set School Information',
		headerTintColor: dark_blue,
		headerStyle: {
			backgroundColor: white,
		}
	}

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		this.state = {
			containerHeight,

			startDate: new Date().toDateString(),
			maxStartDate: new Date(8640000000000000),
	
			endDate: new Date().toDateString(),
			minEndDate: this.startDate,
			disabledEndDate : true,
			endDateValidated: true,

			schoolValidated: true,

			checked: 'none',
			otherSchool: ''
		};

		// Updates the navigation location in redux
		updateNavigation('SchoolInformation', props.navigation.state.routeName);
	}

	componentWillMount() {
		// Loads the information from the state, if there are some info
		if (this.props.SchoolInformationReducer && this.props.SchoolInformationReducer.info && this.props.SchoolInformationReducer.info.info ) {
			this.setState({...this.props.SchoolInformationReducer.info.info});
		}
	}

	/**
	 * The callback function from the startDate date picker
	 * 
	 * @param {String} startDate The start date selected by the user
	 */
	startDateOnDateChange = (startDate) => {
		if (this.state.disabledEndDate) {
			this.setState({
				disabledEndDate: false,
			});
		}

		if (new Date(startDate) > new Date(this.state.endDate)) {
			this.setState({
				endDate: startDate,
			});
		}

		this.setState({
			startDate,
			minEndDate: startDate, 
			endDateValidated: true
		});
	}

	/**
	 * The callback function from the endDate date picker
	 * 
	 * @param {String} endDate The end date selected by the user
	 */
	endDateOnDateChange = (endDate) => {
		this.setState({
			endDate,
			maxStartDate: endDate,
		});
	}

	/**
	 * Checks if the user has entered an end date
	 */
	validateDates = () => {
		let validated = true;

		if (this.state.disabledEndDate === true) {
			this.setState({endDateValidated: false});
			validated = false;
		} else {
			this.setState({endDateValidated: true});
		}

		if (this.state.checked === 'none') {
			this.setState({schoolValidated: false});
			validated = false;
		} else {
			this.setState({schoolValidated: true});
		}
		
		return validated;
	}

	/**
	 * Saves the information into redux and goes back to the previous screen if it's validated
	 */
	saveInformation = () => {
		if (this.validateDates()) {
			this.props.dispatch(setSchoolInformation(this.state));
			let temp = this.props.navigation.state.params;

			if (temp) {
				if (temp.schoolSchedule || temp.reviewEvent) {
					if (this.state.checked === 'third') {
						this.props.navigation.navigate(CourseRoute);
					} else {
						this.props.navigation.navigate(SchoolScheduleRoute);
					}
				} else {
					this.props.navigation.pop();
				}
			} else {
				this.props.navigation.pop();
			}
		}
	}

	render() {
		const { containerHeight, startDate, minStartDate, maxStartDate, minEndDate, endDate, disabledEndDate, endDateValidated, checked, schoolValidated } = this.state;

		return (
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<ScrollView>
					<View style={[styles.content, {height: containerHeight}]} onLayout={(event) => {
						let height = event.nativeEvent;
						console.log(height);
					}}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Please enter the information about your current semester</Text>
							
							<MaterialIcons name="info-outline"
								size={130}
								color={dark_blue}/>
						</View>

						<View style={styles.bottomContent}>
							<View style={styles.school}> 
								<Text style={styles.subHeader}>Post-Secondary Institution</Text>

								<View>
									<View style={styles.radioButton}>
										<RadioButton.Android color={dark_blue}
											uncheckedColor={schoolValidated ? gray : 'red'}
											value="first"
											status={checked === 'first' ? 'checked' : 'unchecked'}
											onPress={() => {
												this.setState({
													checked: 'first',
													schoolValidated: true
												});
												this.refs._other.blur();
											}} />

										<TouchableOpacity onPress={() => {
											this.setState({
												checked: 'first',
												schoolValidated: true
											});
											this.refs._other.blur();
										}}>
											<Text style={[styles.smallText, {color: schoolValidated ? null : 'red'}]}>
												Carleton University
											</Text>
										</TouchableOpacity>
									</View>
									
									<View style={styles.radioButton}>
										<RadioButton.Android color={dark_blue}
											uncheckedColor={schoolValidated ? gray : 'red'}
											value="second"
											status={checked === 'second' ? 'checked' : 'unchecked'}
											onPress={() => {
												this.setState({
													checked: 'second',
													schoolValidated: true
												});
												this.refs._other.blur();
											}} />

										<TouchableOpacity onPress={() => {
											this.setState({
												checked: 'second',
												schoolValidated: true
											});
											this.refs._other.blur();
										}}>
											<Text style={[styles.smallText, {color: schoolValidated ? null : 'red'}]}>
												University of Ottawa
											</Text>
										</TouchableOpacity>
									</View>

									<View style={styles.radioButton}>
										<RadioButton.Android color={dark_blue}
											uncheckedColor={schoolValidated ? gray : 'red'}
											value="third"
											status={checked === 'third' ? 'checked' : 'unchecked'}
											onPress={() => {
												this.setState({ 
													checked: 'third',
													schoolValidated: true
												});
												this.refs._other.focus();
											}} />
										<TextInput placeholder="Other"
											ref="_other"
											style={styles.otherInput}
											maxLength={1024}
											onFocus={() => this.setState({
												checked: 'third',
												schoolValidated: true
											})}
											onChangeText={(otherSchool) => this.setState({checked: 'third', otherSchool})}
											value={this.state.otherSchool}/>
									</View>

									{ 
										schoolValidated ?
											null
											:
											<Text style={styles.error}>Please select an institution</Text>
									}
								</View>
							</View>

							<View style={styles.duration}>
								<Text style={styles.subHeader}>Semester Duration</Text>
								
								<View style={styles.date}>
									<Text style={styles.blueTitle}>
										Start
									</Text>
									
									<DatePicker showIcon={false} 
										date={startDate} 
										mode="date" 
										style={{width:140}}
										customStyles={{
											dateInput:{borderWidth: 0}, 
											dateText:{
												fontFamily: 'OpenSans-Regular',
												color: !endDateValidated ? 'red' : gray
											}
										}}
										placeholder={startDate}
										format="ddd., MMM DD, YYYY"
										minDate={minStartDate}
										maxDate={maxStartDate}
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										onDateChange={this.startDateOnDateChange} />
								</View>
								
								<View style={styles.date}>
									<Text style={styles.blueTitle}>
										End
									</Text>

									<DatePicker showIcon={false} 
										date={endDate} 
										mode="date" 
										style={{width:140}}
										disabled = {disabledEndDate}
										customStyles={{
											disabled:{backgroundColor: 'transparent'}, 
											dateInput:{borderWidth: 0}, 
											dateText:{
												fontFamily: 'OpenSans-Regular', 
												color: !endDateValidated ? 'red' : gray,
												textDecorationLine: disabledEndDate ? 'line-through' : 'none'}}} 
										placeholder={endDate} 
										format="ddd., MMM DD, YYYY" 
										minDate={minEndDate}
										confirmBtnText="Confirm" 
										cancelBtnText="Cancel" 
										onDateChange={this.endDateOnDateChange} />
								</View>

								{ 
									endDateValidated ?
										null
										:
										<Text style={styles.error}>Please select a Start and End date</Text>
								}
							</View>
						</View>

						<View style={{marginBottom:20}}>
							<BottomButtons twoButtons={false} 
								buttonText={['Done']}
								buttonMethods={[this.saveInformation]}
							/>
						</View>
						
					</View>
				</ScrollView>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { SchoolInformationReducer } = state;

	return {
		SchoolInformationReducer
	};
};

export default connect(mapStateToProps, null)(SchoolInformation);