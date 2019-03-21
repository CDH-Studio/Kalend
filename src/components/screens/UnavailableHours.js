import React from 'react';
import { ScrollView, StatusBar, Text, View, Switch, TouchableOpacity, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import {setUnavailableHours} from '../../actions';
import { UnavailableFixedRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { unavailableHoursStyles as styles, white, blue, gray, statusBlueColor, dark_blue } from '../../styles';

/**
 * Permits the user to input the hours they are not available or don't want to have anything booked
 */
class UnavailableHours extends React.PureComponent {

	static navigationOptions = {
		title: 'Set Unavailable Hours',
		headerStyle: {
			backgroundColor: white
		},
	};

	constructor(props) {
		super(props);

		this.state = { 
			sleepWeek: false,
			startSleepWeek: new Date().toLocaleTimeString(),
			endSleepWeek: new Date().toLocaleTimeString(),
			disabledEndSleepWeek: true,
			endSleepWeekValidated: true,
			sleepWeekEnd: false,
			startSleepWeekEnd: new Date().toLocaleTimeString(),
			endSleepWeekEnd: new Date().toLocaleTimeString(),
			disabledEndSleepWeekEnd: true,
			endSleepWeekEndValidated: true,

			commutingWeek: false,
			startCommutingWeek: new Date().toLocaleTimeString(),
			endCommutingWeek: new Date().toLocaleTimeString(),
			disabledEndCommutingWeek: true,
			endCommutingWeekValidated: true,
			commutingWeekEnd: false,
			startCommutingWeekEnd: new Date().toLocaleTimeString(),
			endCommutingWeekEnd: new Date().toLocaleTimeString(),
			disabledEndCommutingWeekEnd: true,
			endCommutingWeekEndValidated: true,

			eatingWeek: false,
			startEatingWeek: new Date().toLocaleTimeString(),
			endEatingWeek: new Date().toLocaleTimeString(),
			disabledEndEatingWeek: true,
			endEatingWeekValidated: true,
			eatingWeekEnd: false,
			startEatingWeekEnd: new Date().toLocaleTimeString(),
			endEatingWeekEnd: new Date().toLocaleTimeString(),
			disabledEndEatingWeekEnd: true,
			endEatingWeekEndValidated: true,

			otherWeek: false,
			startOtherWeek: new Date().toLocaleTimeString(),
			endOtherWeek: new Date().toLocaleTimeString(),
			disabledEndOtherWeek: true,
			endOtherWeekValidated: true,
			otherWeekEnd: false,
			startOtherWeekEnd: new Date().toLocaleTimeString(),
			endOtherWeekEnd: new Date().toLocaleTimeString(),
			disabledEndOtherWeekEnd: true,
			endOtherWeekEndValidated: true,
		};
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentDidMount() {
		if (this.props.UnavailableReducer && this.props.UnavailableReducer.info && this.props.UnavailableReducer.info.info) {
			this.setState({...this.props.UnavailableReducer.info.info});
		}
	}

	/**
	 * Enables endTime and sets it to the startTime
	 */
	enableEndTime(disabledEndTime, startTime, endTime) {
		if (this.state[disabledEndTime] === true) {
			this.setState({[endTime]: this.state[startTime]});
			return false;
		} else {
			//do nothing
		}
	}

	/**
	 * To go to the appropriate Fixed Event screen according to the current route
	 */
	manualImport() {
		this.props.navigation.navigate(UnavailableFixedRoute);
	}

	/**
	 * Validates the EndTime fields
	 */
	fieldValidation = () => {
		let validated = true;

		let hourTypes = [
			'sleepWeek',
			'sleepWeekEnd',
			'commutingWeek',
			'commutingWeekEnd',
			'eatingWeek',
			'eatingWeekEnd',
			'otherWeek',
			'otherWeekEnd'
		];

		hourTypes.map( type => {
			if (this.state[type] === true) {
				if (this.state['disabledEnd' + type.charAt(0).toUpperCase() + type.slice(1)] === true) {
					this.setState({['end' + type.charAt(0).toUpperCase() + type.slice(1) + 'Validated']: false});
					validated = false;
				} else {
					this.setState({['end' + type.charAt(0).toUpperCase() + type.slice(1) + 'Validated']: true});
				}
			}
		});

		return validated;
	}


	/**
	 * To go to the next screen and save the required information
	 */
	next = () => {
		let validated = this.fieldValidation();
		if (!validated) {
			return;
		}

		this.props.dispatch(setUnavailableHours(this.state));
		
		this.props.navigation.pop();
	}
	
	render() {
		let hourTypes = [
			'sleepWeek',
			'sleepWeekEnd',
			'commutingWeek',
			'commutingWeekEnd',
			'eatingWeek',
			'eatingWeekEnd',
			'otherWeek',
			'otherWeekEnd'
		];
		let error = {};

		/**
		 * In order to show components based on current route
		 */
		hourTypes.forEach( type => {
			if (this.state[type] === true) {
				let endValidated = 'end' + type.charAt(0).toUpperCase() + type.slice(1);
				if (!this.state[endValidated + 'Validated']) {
					error[endValidated] = <Text style={styles.errorEndTime}>Please select a Start and End Time.</Text>;
				} else {
					error[endValidated] = null;
				}
			}
		});

		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<ScrollView>
					<View style={[styles.content]}>
						<View style={styles.instruction}>
							<Text style={styles.text}>Add the hours for which you're not available or you don't want anything to be booked.</Text>
							<MaterialCommunityIcons name="clock-alert-outline"
								size={130}
								color={dark_blue}/>
						</View>

						<View style={styles.hoursView}>
							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="sleep"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>Sleeping Hours</Text>
								</View>
								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.sleepWeek && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(sleepWeek) => this.setState({sleepWeek})}
													value={this.state.sleepWeek} />
											</View>
											{this.state.sleepWeek ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startSleepWeek} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endSleepWeekValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startSleepWeek) => {
															this.setState({
																endSleepWeekValidated: true, 
																startSleepWeek
															});
															this.setState({disabledEndSleepWeek: this.enableEndTime('disabledEndSleepWeek', 'startSleepWeek', 'endSleepWeek')});
														}} />

													<Text> - </Text>

													<DatePicker showIcon={false} 
														date={this.state.endSleepWeek} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndSleepWeek}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endSleepWeekValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndSleepWeek ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endSleepWeek) => this.setState({endSleepWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endSleepWeek}
										</View>

										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week-End</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.sleepWeekEnd && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(sleepWeekEnd) => this.setState({sleepWeekEnd})}
													value={this.state.sleepWeekEnd} />
											</View>

											{this.state.sleepWeekEnd ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startSleepWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endSleepWeekEndValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startSleepWeekEnd) => {
															this.setState({
																endSleepWeekEndValidated: true, 
																startSleepWeekEnd
															});
															this.setState({disabledEndSleepWeekEnd: this.enableEndTime('disabledEndSleepWeekEnd', 'startSleepWeekEnd', 'endSleepWeekEnd')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endSleepWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndSleepWeekEnd}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endSleepWeekEndValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndSleepWeekEnd ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endSleepWeekEnd) => this.setState({endSleepWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endSleepWeekEnd}
										</View>
									</View>
								</View>
							</View>

							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="train-car"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>Commuting Hours</Text>
								</View>

								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.commutingWeek && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(commutingWeek) => this.setState({commutingWeek})}
													value={this.state.commutingWeek} />
											</View>

											{this.state.commutingWeek ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startCommutingWeek} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endCommutingWeekValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startCommutingWeek) => {
															this.setState({
																endCommutingWeekValidated: true, 
																startCommutingWeek
															});
															this.setState({disabledEndCommutingWeek: this.enableEndTime('disabledEndCommutingWeek', 'startCommutingWeek', 'endCommutingWeek')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endCommutingWeek} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndCommutingWeek}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endCommutingWeekValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndCommutingWeek ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endCommutingWeek) => this.setState({endCommutingWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endCommutingWeek}
										</View>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week-End</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.commutingWeekEnd && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(commutingWeekEnd) => this.setState({commutingWeekEnd})}
													value={this.state.commutingWeekEnd} />
											</View>

											{this.state.commutingWeekEnd ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startCommutingWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endCommutingWeekEndValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startCommutingWeekEnd) => {
															this.setState({
																endCommutingWeekEndValidated: true, 
																startCommutingWeekEnd
															});
															this.setState({disabledEndCommutingWeekEnd: this.enableEndTime('disabledEndCommutingWeekEnd', 'startCommutingWeekEnd', 'endCommutingWeekEnd')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endCommutingWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndCommutingWeekEnd}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endCommutingWeekEndValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndCommutingWeekEnd ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endCommutingWeekEnd) => this.setState({endCommutingWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endCommutingWeekEnd}
										</View>
									</View>
								</View>
							</View>

							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="food"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>Eating Hours</Text>
								</View>

								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.eatingWeek && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(eatingWeek) => this.setState({eatingWeek})}
													value={this.state.eatingWeek} />
											</View>

											{this.state.eatingWeek ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startEatingWeek} 
														mode="time"
														style={styles.timeWidth} 
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endEatingWeekValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startEatingWeek) => {
															this.setState({
																endEatingWeekValidated: true,
																startEatingWeek});
															this.setState({disabledEndEatingWeek: this.enableEndTime('disabledEndEatingWeek', 'startEatingWeek', 'endEatingWeek')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endEatingWeek} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndEatingWeek}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endEatingWeekValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndEatingWeek ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endEatingWeek) => this.setState({endEatingWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endEatingWeek}
										</View>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week-End</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.eatingWeekEnd && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(eatingWeekEnd) => this.setState({eatingWeekEnd})}
													value={this.state.eatingWeekEnd} />
											</View>

											{this.state.eatingWeekEnd ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startEatingWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endEatingWeekEndValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startEatingWeekEnd) => {
															this.setState({
																endEatingWeekEndValidated: true,
																startEatingWeekEnd});
															this.setState({disabledEndEatingWeekEnd: this.enableEndTime('disabledEndEatingWeekEnd', 'startEatingWeekEnd', 'endEatingWeekEnd')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endEatingWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndEatingWeekEnd}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endEatingWeekEndValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndEatingWeekEnd ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endEatingWeekEnd) => this.setState({endEatingWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endEatingWeekEnd}
										</View>
									</View>
								</View>
							</View>

							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="timelapse"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>Other Unavailable Hours</Text>
								</View>

								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.otherWeek && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(otherWeek) => this.setState({otherWeek})}
													value={this.state.otherWeek} />
											</View>

											{this.state.otherWeek ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startOtherWeek} 
														mode="time"
														style={styles.timeWidth} 
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endOtherWeekValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startOtherWeek) => {
															this.setState({
																endOtherWeekValidated: true,
																startOtherWeek});
															this.setState({disabledEndOtherWeek: this.enableEndTime('disabledEndOtherWeek', 'startOtherWeek', 'endOtherWeek')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endOtherWeek} 
														mode="time" 
														style={styles.timeWidth}
														disabled={this.state.disabledEndOtherWeek}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endOtherWeekValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndOtherWeek ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endOtherWeek) => this.setState({endOtherWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endOtherWeek}
										</View>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>Week-End</Text>

												<Switch trackColor={{false: 'lightgray', true: blue}}
													thumbColor={(this.state.otherWeekEnd && Platform.OS !== 'ios') ? dark_blue : null}
													onValueChange={(otherWeekEnd) => this.setState({otherWeekEnd})}
													value={this.state.otherWeekEnd} />
											</View>

											{this.state.otherWeekEnd ?
												<View style={styles.rowTime}>
													<DatePicker showIcon={false} 
														date={this.state.startOtherWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{
																fontFamily: 'OpenSans-Regular',
																color: !this.state.endOtherWeekEndValidated ? '#ff0000' : gray
															}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel" 
														is24Hour={false}
														onDateChange={(startOtherWeekEnd) => {
															this.setState({
																endOtherWeekEndValidated: true,
																startOtherWeekEnd});
															this.setState({disabledEndOtherWeekEnd: this.enableEndTime('disabledEndOtherWeekEnd', 'startOtherWeekEnd', 'endOtherWeekEnd')});
														}} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endOtherWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														disabled= {this.state.disabledEndOtherWeekEnd}
														customStyles={{
															disabled:{backgroundColor: 'transparent'}, 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular',
																color: !this.state.endOtherWeekEndValidated ? '#ff0000' : gray,
																textDecorationLine: this.state.disabledEndOtherWeekEnd ? 'line-through' : 'none'}
														}}
														format="h:mm A" 
														confirmBtnText="Confirm" 
														cancelBtnText="Cancel"
														is24Hour={false}
														onDateChange={(endOtherWeekEnd) => this.setState({endOtherWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}

											{error.endOtherWeekEnd}
										</View>
									</View>
								</View>
							</View>
						
							<Text style={styles.manual}>
								<Text style={styles.textManual}>Want to add more specific unavailable hours? Add them as </Text>
								<Text style={styles.buttonManual} onPress={() => this.manualImport()}>Fixed Events</Text>
								<Text style={styles.textManual}>!</Text>
							</Text>
						</View>

						<View style={[styles.buttons, {marginBottom: 20}]}>
							<TouchableOpacity style={[styles.button, {width:'100%'}]} onPress={this.next}>
								<Text style={styles.buttonText}>Done</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { UnavailableReducer } = state;

	return {
		UnavailableReducer
	};
};

export default connect(mapStateToProps, null)(UnavailableHours);