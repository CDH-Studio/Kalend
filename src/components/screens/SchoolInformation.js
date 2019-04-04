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
import { dateVerification } from '../../services/helper';
import { ScrollView } from 'react-native-gesture-handler';

const moment = require('moment');
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

			startDate: moment().format('ddd., MMM DD, YYYY'),
			endDate: moment().format('ddd., MMM DD, YYYY'),

			schoolValidated: true,

			checked: 'none',
			otherSchool: ''
		};

		updateNavigation('SchoolInformation', props.navigation.state.routeName);
	}

	componentWillMount() {
		if (this.props.SchoolInformationReducer && this.props.SchoolInformationReducer.info && this.props.SchoolInformationReducer.info.info ) {
			this.setState({...this.props.SchoolInformationReducer.info.info});
		}
	}

	/**
	 * Checks if the user has entered an end date
	 */
	fieldValidation = () => {
		let validated = true;

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
		if (this.fieldValidation()) {
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
		const { containerHeight, startDate, endDate, checked, schoolValidated } = this.state;

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

						<View>
							<View style={styles.school}> 
								<Text style={styles.subHeader}>Post-Secondary Institution</Text>

								<View>
									<View style={styles.radioButton}>
										<RadioButton.Android color={dark_blue}
											uncheckedColor={schoolValidated ? gray : red}
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
											<Text style={[styles.smallText, {color: schoolValidated ? null : red}]}>
												Carleton University
											</Text>
										</TouchableOpacity>
									</View>
									
									<View style={styles.radioButton}>
										<RadioButton.Android color={dark_blue}
											uncheckedColor={schoolValidated ? gray : red}
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
											<Text style={[styles.smallText, {color: schoolValidated ? null : red}]}>
												University of Ottawa
											</Text>
										</TouchableOpacity>
									</View>

									<View style={styles.radioButton}>
										<RadioButton.Android color={dark_blue}
											uncheckedColor={schoolValidated ? gray : red}
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
									<Text style={styles.blueTitle}>Start</Text>
									
									<DatePicker showIcon={false} 
										date={startDate} 
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
										}} />
								</View>
								
								<View style={styles.date}>
									<Text style={styles.blueTitle}>End</Text>

									<DatePicker showIcon={false} 
										date={endDate} 
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
										}} />
								</View>
							</View>
						</View>

						<View>
							<BottomButtons twoButtons={false} 
								buttonText={['Done']}
								buttonMethods={[this.saveInformation]} />
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