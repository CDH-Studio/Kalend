import React from 'react';
import { StatusBar, View, Platform, FlatList, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Animated, NativeModules, LayoutAnimation } from 'react-native';
import { TextInput, Snackbar, TouchableRipple } from 'react-native-paper';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import Modal from 'react-native-modal';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { getStrings } from '../../services/helper';
import { store } from '../../store';
import { compareScheduleStyles as styles, dark_blue, gray, whiteRipple, blueRipple, statusBarDark } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { getAvailabilitiesCalendars, listSharedKalendCalendars, addPermissionPerson, deleteOtherSharedCalendar } from '../../services/service';
import CalendarScheduleItem from '../CalendarScheduleItem';
import { getUserInfoByColumnService } from '../../services/api/storage_services';
import { sendMessage } from '../../services/firebase_messaging';

LocaleConfig.locales.en = LocaleConfig.locales[''];
LocaleConfig.locales['fr'] = {
	monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
	monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
	dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
	dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

const moment = extendMoment(Moment);

// Enables the LayoutAnimation on Android
const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

/**
 * The screen for comparing schedules
 */
class CompareSchedule extends React.PureComponent {

	defaultLocale = store.getState().SettingsReducer.language;
	listHeight = 280;
	strings = getStrings().CompareSchedule;

	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);

		this.state = {
			userAvailabilities: [],
			selected: (new Map()),
			searchModalVisible: false,
			snackbarVisible: false,
			snackbarTime: 3000,
			snackbarText: '',
			loadingSharedList: true,
			startDate: moment().startOf('day'),
			endDate: moment().startOf('day').add(90, 'd'),
			showCalendar: false,
			animatedHeight: this.listHeight
		};

		updateNavigation('CompareSchedule', props.navigation.state.routeName);
		LocaleConfig.defaultLocale = this.defaultLocale;
	}

	componentWillMount() {
		this.refreshData();
	}

	/**
	 * Funciton to be called to reload data from the flatList
	 */
	refreshData = () => {
		this.setState({loadingSharedList: true});
		setTimeout(() => {
			listSharedKalendCalendars().then((data) => {
				this.setState({
					userAvailabilities: data,
					selected: (new Map()),
					loadingSharedList: false
				});
			});
		}, 500);
	}

	/**
	 * The callback function when the CalendarItem is touched
	 */
	_onPressItem = (id) => {
		this.setState((state) => {
			const selected = new Map(state.selected);
			selected.set(id, !selected.get(id));
			return {selected};
		});
	};
	
	/**
	 * The render function for the items in the flatList
	 */
	_renderItem = ({item, index}) => {
		return (
			<CalendarScheduleItem id={index}
				onPressItem={this._onPressItem}
				selected={!!this.state.selected.get(index)}
				name={item.id} />
		);
	};

	/**
	 * Callback fuction when the button add is touched in the modal
	 */
	addPerson = () => {
		addPermissionPerson(this.state.searchText)
			.then(() => {
				// getUserInfoByColumnService({
				// 	columns: ['FIREBASEID'],
				// 	where: {
				// 		value: this.state.searchText,
				// 		field: 'EMAIL'
				// 	}
				// });

				this.setState({
					snackbarText: this.strings.addPermission,
					snackbarVisible: true
				});
			})
			.catch((err) => {
				this.setState({
					snackbarText: err,
					snackbarVisible: true
				});
			});
	}

	/**
	 * Callback function when the button to delete/remove people is touched
	 */
	removePeople = () => {
		let selectedValue = this.getListIdSelected();
		let empty = selectedValue.length === 0;
		let error = false;

		selectedValue.map(id => {
			deleteOtherSharedCalendar(id)
				.catch((err) => {
					this.setState({
						snackbarText: err,
						snackbarVisible: true
					});
					error = true;
				});
		});

		if (!empty) {
			if (!error) {
				this.setState({
					snackbarText: this.strings.removePermission,
					snackbarVisible: true
				});
			}
	
			this.refreshData();
		}
	}

	/**
	 * Returns a list of calendarIds that are selected from the flatList
	 */
	getListIdSelected = () => {
		let selectedValue = [];

		for (const entry of this.state.selected.entries()) {
			if (entry[1]) {
				selectedValue.push(this.state.userAvailabilities[entry[0]].id);
			}
		}

		return selectedValue;
	}

	/**
	 * Callback function when seeAvailabilities is triggered
	 */
	seeAvailabilities = () => {
		let selectedValue = this.getListIdSelected();

		if (this.state.showCalendar) {
			this.setState({
				showCalendar: false,
				agendaData: {},
			}, () => {
				this.forceUpdate();
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
				this.setState({animatedHeight: this.listHeight});
				// Animated.timing(
				// 	this.state.animatedHeight,
				// 	{
				// 		toValue: this.listHeight,
				// 		useNativeDriver: true,
				// 	},
				// ).start();
			});
		} else {
			if (selectedValue.length === 0) {
				this.setState({
					snackbarText: this.strings.noCheckbox,
					snackbarVisible: true
				});
			} else {
				getAvailabilitiesCalendars([...selectedValue, this.props.calendarID], this.state.startDate.toJSON(), this.state.endDate.toJSON())
					.then(data => {
						let startDate = moment(this.state.startDate);

						// Creates the basic object for the wix calendar
						let dates = {};
						while(startDate.isBefore(this.state.endDate)) {
							dates[startDate.format('YYYY-MM-DD')] = [];
							startDate.add(1, 'd');
						}

						// Flattens the data received
						let busyStringRanges = Object.values(data.calendars).map(value => value.busy).flat(1);

						// Converts them to moment ranges
						let ranges = busyStringRanges.map(i => {
							let start = moment(i.start);
							let end = moment(i.end);

							return moment.range(start, end);
						});

						// Checks for overlaping ranges, combines them if they are
						for (let i = 0; i < ranges.length - 1; i++) {
							for (let j = i+1; j < ranges.length; j++) {
								if (ranges[i].overlaps(ranges[j], { adjacent: true })) {
									ranges[i] = ranges[i].add(ranges[j], { adjacent: true });
									ranges.splice(j, 1);
									j = i;
								}
							}
						}

						// Split dates
						for (let i = 0; i < ranges.length - 1; i++) {
							Object.keys(dates).map(date => {
								if (ranges[i].contains(moment(date))) {
									ranges[i] = moment.range(
										ranges[i].start,
										moment(date)
									);
									ranges.push(moment.range(
										moment(date),
										ranges[i].end
									));
								}
							});
						}

						// Formats to wix calendar data
						ranges.map(range => {
							dates[range.start.format('YYYY-MM-DD')].push({
								start: range.start,
								end: range.end
							});
						});
						
						LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
						this.setState({animatedHeight: 0});

						// Animated.timing(
						// 	// Animate value over time
						// 	this.state.animatedHeight, // The value to drive
						// 	{
						// 		toValue: 0,
						// 		useNativeDriver: true,
						// 	},
						// ).start(); // Start the animation
						this.setState({
							agendaData: dates,
							showCalendar: true
						});
					})
					.catch((err) => {
						this.setState({
							snackbarText: err,
							snackbarVisible: true
						});
					});
			}
		}

	}

	/**
	 * The render function for each event in the calendar
	 * 
	 * @param {Object} item Information about the current event
	 */
	renderItem(item) {
		return (
			<View style={styles.item}>
				<Text style={styles.itemText}>{item.start.format('h:mm A')}</Text>
				<Text style={styles.itemTextAMPM}> - </Text>
				<Text style={styles.itemText}>{item.end.format('h:mm A')}</Text>
			</View>
		);
	}

	/**
	 * The render function for empty dates
	 */
	renderEmptyData = () => {
		return (
			<View style={styles.emptyData}>
				{
					this.state.showCalendar ? 
						<Text style={styles.eventsDayTitle}>{this.strings.availabilities}</Text> : null
				}
				
				<View style={styles.noEvents}>
					<Text style={styles.noEventsText}>{ this.state.showCalendar ?
						this.strings.noAvailabilities : this.strings.instruction}</Text>
				</View>
			</View>
		);
	}
	
	rowHasChanged = (r1, r2) => {
		return r1.name !== r2.name;
	}

	shouldChangeDay = (r1, r2) => {
		return r1 !== r2;
	}

	render() {
		const { userAvailabilities, searchModalVisible, snackbarVisible, snackbarText, snackbarTime, loadingSharedList, agendaData, showCalendar, animatedHeight } = this.state;

		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBarDark} />

				{
					showCalendar ?
						null :
						<Animated.View style={[styles.peopleSelection, {height:  animatedHeight}]}>
							<Text style={[styles.eventsDayTitle, {marginTop: 0}]}>{this.strings.compareWith}</Text>

							{ 
								loadingSharedList ? 
									<View style={styles.activityIndicatorContainer}>
										<ActivityIndicator animating={loadingSharedList} 
											size="large" 
											color={gray} />
									</View> :
									<FlatList data={userAvailabilities}
										renderItem={this._renderItem}
										keyExtractor={(item, index) => index.toString()}
										style={styles.flatList} 
										scrollEnabled={userAvailabilities.length !== 0}
										ListEmptyComponent={() => (
											<TouchableOpacity onPress={this.refreshData}>
												<View style={styles.emptyContainer}>
													<MaterialCommunityIcons size={50}
														name='calendar-search'
														color={gray}/>
													<Text style={styles.emptyTitle}>{this.strings.noCalendars}</Text> 
													<Text style={styles.emptyDescription}>{this.strings.refresh}</Text> 
												</View>
											</TouchableOpacity>
										)}
										refreshControl={
											<RefreshControl
												refreshing={this.state.loadingSharedList}
												onRefresh={this.refreshData}
												tintColor={gray}
												colors={[dark_blue]} />
										} />
							}
						</Animated.View> }

				<View style={[styles.buttons, {justifyContent: 'space-between'}]}>
					{
						showCalendar ?
							null :
							<TouchableRipple onPress={this.removePeople}
								style={styles.sideButton}
								rippleColor={whiteRipple}
								underlayColor={whiteRipple}>
								<Text style={styles.sideButtonText}>{this.strings.delete}</Text>
							</TouchableRipple>}

					<TouchableRipple onPress={this.seeAvailabilities}
						style={[styles.availabilityButton, {width: showCalendar ? '100%' : null}]}
						rippleColor={whiteRipple}
						underlayColor={blueRipple}>
						<Text style={styles.availabilityButtonText}>
							{ showCalendar ? this.strings.addRemove : this.strings.seeAvailabilities }
						</Text>
					</TouchableRipple>
					<TouchableRipple onPress={() => this.setState({searchModalVisible: true}) }
						style={[styles.sideButton, {opacity: showCalendar ? 0 : 1}]}
						disabled={showCalendar}
						rippleColor={whiteRipple}
						underlayColor={whiteRipple}>
						<Text style={styles.sideButtonText}>{this.strings.allow}</Text>
					</TouchableRipple>
				</View>

				<Agenda ref='agenda'
					items={agendaData}
					refreshing={loadingSharedList}
					renderItem={this.renderItem}
					renderEmptyData={this.renderEmptyData}
					rowHasChanged={this.rowHasChanged}
					listTitle={this.strings.availabilities}
					renderEmptyDate={() => {
						return (<View style={{height: 70}}/>);
					}}
					pastScrollRange={1}
					futureScrollRange={4}
					minDate={this.state.startDate.format('YYYY-MM-DD')}
					maxDate={showCalendar ? moment(this.state.endDate).format('YYYY-MM-DD') : this.state.startDate.format('YYYY-MM-DD')}
					shouldChangeDay={this.shouldChangeDay}
					hideKnob={!showCalendar}
					theme={{agendaKnobColor: dark_blue}}/>


				<Modal isVisible={searchModalVisible}
					avoidKeyboard
					onBackdropPress={() => this.setState({searchModalVisible: false})}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>{this.strings.enterEmail}</Text>

						<TextInput  mode="outlined"
							style={styles.modalTextInput}
							theme={{colors:{primary: dark_blue}}}
							label={this.strings.email}
							value={this.state.text}
							autoCapitalize='none'
							autoComplete='email'
							keyboardType='email-address'
							onChangeText={searchText => this.setState({ searchText })}/>

						<View style={styles.modalButtons}>
							<TouchableOpacity onPress={() => this.setState({searchModalVisible: false})}>
								<Text style={styles.modalCloseText}>{this.strings.close}</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {
								this.setState({searchModalVisible: false});
								this.addPerson();
							}}>
								<Text style={styles.modalAddText}>{this.strings.add}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

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
	const { id } = state.CalendarReducer;

	return {
		calendarID: id
	};
};

export default connect(mapStateToProps, null)(CompareSchedule);