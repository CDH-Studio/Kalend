import React from 'react';
import { ScrollView, StatusBar, Text, View, Switch, TouchableOpacity, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import {setUnavailableHours} from '../../actions';
import { storeUserHours } from '../../services/api/storage_services';
import { UnavailableFixedRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { unavailableHoursStyles as styles, white, statusBlueColor, dark_blue, lightBlue } from '../../styles';
import { getStrings } from '../../services/helper';

const moment = require('moment');
require('moment-round');

/**
 * Permits the user to input the hours they are not available or don't want to have anything booked
 */
class UnavailableHours extends React.PureComponent {

	strings = getStrings().UnavailableHours;
	buttonStrings = getStrings().BottomButtons;

	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.state.params.title,
			headerStyle: {
				backgroundColor: white
			},
		};
	};

	constructor(props) {
		super(props);

		this.state = { 
			sleepWeek: false,
			startSleepWeek: moment().round(30, 'minutes').format('h:mm A'),
			endSleepWeek: moment().round(30, 'minutes').format('h:mm A'),
			sleepWeekEnd: false,
			startSleepWeekEnd: moment().round(30, 'minutes').format('h:mm A'),
			endSleepWeekEnd: moment().round(30, 'minutes').format('h:mm A'),

			commutingWeek: false,
			startCommutingWeek: moment().round(30, 'minutes').format('h:mm A'),
			endCommutingWeek: moment().round(30, 'minutes').format('h:mm A'),
			commutingWeekEnd: false,
			startCommutingWeekEnd: moment().round(30, 'minutes').format('h:mm A'),
			endCommutingWeekEnd: moment().round(30, 'minutes').format('h:mm A'),

			eatingWeek: false,
			startEatingWeek: moment().round(30, 'minutes').format('h:mm A'),
			endEatingWeek: moment().round(30, 'minutes').format('h:mm A'),
			eatingWeekEnd: false,
			startEatingWeekEnd: moment().round(30, 'minutes').format('h:mm A'),
			endEatingWeekEnd: moment().round(30, 'minutes').format('h:mm A'),

			otherWeek: false,
			startOtherWeek: moment().round(30, 'minutes').format('h:mm A'),
			endOtherWeek: moment().round(30, 'minutes').format('h:mm A'),
			otherWeekEnd: false,
			startOtherWeekEnd: moment().round(30, 'minutes').format('h:mm A'),
			endOtherWeekEnd: moment().round(30, 'minutes').format('h:mm A')
		};
		
		updateNavigation('UnavailableHours', props.navigation.state.routeName);
	}

	componentDidMount() {
		if (this.props.UnavailableReducer && this.props.UnavailableReducer.info && this.props.UnavailableReducer.info.info) {
			this.setState({...this.props.UnavailableReducer.info.info});
		}
	}

	/**
	 * To go to the appropriate Fixed Event screen according to the current route
	 */
	manualImport() {
		this.props.navigation.navigate(UnavailableFixedRoute, {addTitle: 'Add Unavailable Hours'});
	}

	/**
	 * To go to the next screen and save the required information
	 */
	next = () => {
		let data = this.formatDataForServer();

		this.props.dispatch(setUnavailableHours(this.state));
		storeUserHours(data).then(success => {
			if(success) this.props.navigation.pop();
		});
		
	}
	
	formatDataForServer = () => {
		let data = [];
		if (this.state.commutingWeek) data.push({'START': this.state.startCommuteWeek, 'END': this.state.endCommuteWeek, 'WEEK': true, 'CATEGORY': 'COMMUTE'});
		if (this.state.commutingWeekEnd) data.push({'START': this.state.startCommuteWeekEnd, 'END': this.state.endCommuteWeekEnd, 'WEEK': false, 'CATEGORY': 'COMMUTE'});
		if (this.state.otherWeek) data.push({'START': this.state.startOtherWeek, 'END': this.state.endOtherWeek, 'WEEK': true, 'CATEGORY': 'OTHER'});
		if (this.state.otherWeekEnd) data.push({'START': this.state.startOtherWeekEND, 'END': this.state.endOtherWeekEND, 'WEEK': false, 'CATEGORY': 'OTHER'});
		if (this.state.sleepWeek) data.push({'START': this.state.startSleepWeek, 'END':this.state.endSleepWeek, 'WEEK': true, 'CATEGORY': 'SLEEP'});
		if (this.state.sleepWeekEnd) data.push({'START': this.state.startSleepWeekEnd, 'END': this.state.endSleepWeekEnd, 'WEEK': false, 'CATEGORY': 'SLEEP'});
		if (this.state.eatingWeek) data.push({'START': this.state.startEatingWeek, 'END': this.state.startEatingWeek, 'WEEK': true, 'CATEGORY': 'EATING'});
		if (this.state.eatingWeekEnd) data.push({'START': this.state.startEatingWeekEnd, 'END': this.state.endEatingWeekEnd, 'WEEK': false, 'CATEGORY': 'EATING'});
			
		return data;
	}

	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<ScrollView>
					<View style={[styles.content]}>
						<View style={styles.instruction}>
							<Text style={styles.text}>{this.strings.description}</Text>
							<MaterialCommunityIcons name="clock-alert-outline"
								size={130}
								color={dark_blue}/>
						</View>

						<View style={styles.hoursView}>
							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="sleep"
										size={30}
										color={dark_blue} />

									<Text style={styles.blueTitle}>{this.strings.sleeping}</Text>
								</View>
								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.week}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startSleepWeek) => 
															this.setState({startSleepWeek})
														} />

													<Text> - </Text>

													<DatePicker showIcon={false} 
														date={this.state.endSleepWeek} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endSleepWeek) => this.setState({endSleepWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>

										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.weekEnd}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startSleepWeekEnd) => 
															this.setState({startSleepWeekEnd})	
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endSleepWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endSleepWeekEnd) => this.setState({endSleepWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
									</View>
								</View>
							</View>

							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="train-car"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>{this.strings.commuting}</Text>
								</View>

								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.week}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startCommutingWeek) => 
															this.setState({startCommutingWeek})
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endCommutingWeek} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endCommutingWeek) => this.setState({endCommutingWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.weekEnd}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startCommutingWeekEnd) => 
															this.setState({startCommutingWeekEnd})
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endCommutingWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endCommutingWeekEnd) => this.setState({endCommutingWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
									</View>
								</View>
							</View>

							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="food"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>{this.strings.eating}</Text>
								</View>

								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.week}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startEatingWeek) => 
															this.setState({startEatingWeek})
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endEatingWeek} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endEatingWeek) => this.setState({endEatingWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.weekEnd}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startEatingWeekEnd) => 
															this.setState({startEatingWeekEnd})
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endEatingWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endEatingWeekEnd) => this.setState({endEatingWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
									</View>
								</View>
							</View>

							<View>
								<View style={styles.row}>
									<MaterialCommunityIcons name="timelapse"
										size={30}
										color={dark_blue}/>

									<Text style={styles.blueTitle}>{this.strings.other}</Text>
								</View>

								<View>
									<View style={styles.rowContent}>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.week}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startOtherWeek) => 
															this.setState({startOtherWeek})
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endOtherWeek} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{ 
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endOtherWeek) => this.setState({endOtherWeek})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
										<View style={styles.colContent}>
											<View style={styles.row}>
												<Text style={styles.type}>{this.strings.weekEnd}</Text>

												<Switch trackColor={{false: 'lightgray', true: lightBlue}}
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
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(startOtherWeekEnd) => 
															this.setState({startOtherWeekEnd})
														} />

													<Text> - </Text>
														
													<DatePicker showIcon={false} 
														date={this.state.endOtherWeekEnd} 
														mode="time" 
														style={styles.timeWidth}
														customStyles={{
															dateInput:{borderWidth: 0}, 
															dateText:{fontFamily: 'OpenSans-Regular'}
														}}
														format="h:mm A" 
														confirmBtnText={this.strings.confirmButton}
														cancelBtnText={this.strings.cancelButton}
														locale={'US'}
														is24Hour={false}
														onDateChange={(endOtherWeekEnd) => this.setState({endOtherWeekEnd})} />
												</View> : <View style={[styles.rowTime]}><Text> </Text></View>}
										</View>
									</View>
								</View>
							</View>
						
							<Text style={styles.manual}>
								<Text style={styles.textManual}>{this.strings.manual}</Text>

								<Text style={styles.buttonManual} onPress={() => this.manualImport()}>{this.strings.fixedEvents}</Text>
								
								<Text style={styles.textManual}>!</Text>
							</Text>
						</View>

						<View style={[styles.buttons, {marginBottom: 20}]}>
							<TouchableOpacity style={[styles.button, {width:'100%'}]} onPress={this.next}>
								<Text style={styles.buttonText}>{this.buttonStrings.done}</Text>
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