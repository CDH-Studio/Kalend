import React from 'react';
import { StatusBar, View, Platform, FlatList, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { Checkbox, TextInput, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Agenda } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { compareScheduleStyles as styles, white, dark_blue, blue, gray } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { getAvailabilitiesCalendars, listSharedKalendCalendars, addPermissionPerson, deleteOtherSharedCalendar } from '../../services/service';

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

class MyListItem extends React.PureComponent {
	_onPress = () => {
		this.props.onPressItem(this.props.id);
	};
  
	render() {
		return (
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<Checkbox.Android status={this.props.selected ? 'checked' : 'unchecked'}
					onPress={this._onPress} 
					theme={{colors:{accent:dark_blue}}}/>
				<TouchableOpacity onPress={this._onPress} style={{flexDirection: 'row', alignItems: 'center'}}>
					<View style={{height: 40, width: 40, borderRadius: 20, position: 'absolute', 
					backgroundColor: 'black',
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.4,
				shadowRadius: 3,    
			},
			android: {
				elevation: 4,
			},
		}),}}/>
					<Image style={{height: 40, width: 40, borderRadius: 20}}
						source={{uri:'https://api.adorable.io/avatars/asd'}}/>
					<Text style={{fontFamily: 'Raleway-Regular', color: gray, width: '82%', paddingLeft: 10}}>{this.props.name}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

class CompareSchedule extends React.PureComponent {

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
			loadingSharedList: true
		};

		updateNavigation('CompareSchedule', props.navigation.state.routeName);
	}

	componentWillMount() {
		this.refreshData();
	}

	refreshData = () => {
		this.setState({loadingSharedList: true});
		listSharedKalendCalendars().then((data) => {
			this.setState({
				userAvailabilities: data,
				selected: (new Map()),
				loadingSharedList: false
			});
		});
	}

	_onPressItem = (id) => {
		// updater functions are preferred for transactional updates
		this.setState((state) => {
			// copy the map rather than modifying state.
			const selected = new Map(state.selected);
			selected.set(id, !selected.get(id)); // toggle
			return {selected};
		});
	};
	
	_renderItem = ({item, index}) => {
		return (<MyListItem
			id={index}
			onPressItem={this._onPressItem}
			selected={!!this.state.selected.get(index)}
			name={item.id} />
		);
	};

	addPerson = () => {
		addPermissionPerson(this.state.searchText)
			.then(() => {
				this.setState({
					snackbarText: 'The person can now see your calendar',
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
					snackbarText: 'Successfully removed the selected people',
					snackbarVisible: true
				});
			}
	
			this.refreshData();
		}
	}

	getListIdSelected = () => {
		let selectedValue = [];

		for (const entry of this.state.selected.entries()) {
			if (entry[1]) {
				selectedValue.push(this.state.userAvailabilities[entry[0]].id);
			}
		}

		return selectedValue;
	}

	seeAvailabilities = () => {
		let selectedValue = this.getListIdSelected();

		if (selectedValue.length === 0) {
			this.setState({
				snackbarText: 'Please check some checkboxes before comparing availabilities',
				snackbarVisible: true
			});
		} else {
			getAvailabilitiesCalendars([...selectedValue, this.props.calendarID], moment().startOf('week').toJSON(), moment().endOf('week').toJSON())
				.then(data => {
					let dates = {};
					let startDate = moment().startOf('week');
					for (let i = 0; i < 7; i ++) {
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
							start: range.start.format('h:mm A'),
							end: range.end.format('h:mm A')
						});
					});

					console.log(data);
					console.log(ranges);
					console.log(dates);

					this.setState({
						// dataModalText: JSON.stringify(dates),
						// dataModalVisible: true, 
						agendaData: dates
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

	renderItem(item) {
		return (
			<View style={styles.item}>
				<Text style={styles.itemText}>Not available</Text>
				<Text style={styles.itemText}>{item.start}</Text>
				<Text style={styles.itemText}>{item.end}</Text>
			</View>
		);
	}

	renderEmptyData = () => {
		return <View style={{padding: 10, paddingTop: 0}}>
			<Text style={styles.eventsDayTitle}>Availabilities</Text>
			
			<View style={styles.noEvents}>
				<Text style={styles.noEventsText}>There's no availabilities for the day.</Text>
			</View>
		</View>;
	}
	
	rowHasChanged = (r1, r2) => {
		return r1.name !== r2.name;
	}

	shouldChangeDay = (r1, r2) => {
		return r1 !== r2;
	}

	render() {
		const { userAvailabilities, searchModalVisible, snackbarVisible, snackbarText, snackbarTime, dataModalVisible, dataModalText, loadingSharedList, agendaData } = this.state;


		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={'#166489'} />

				<View style={{padding: 10, paddingHorizontal: 25}}>
					<Text style={{fontFamily: 'Raleway-Bold', fontSize: 16, color: gray}}>Compare schedules with</Text>

					{ loadingSharedList ? 
						<View style={{height: 160, justifyContent: 'center'}}>
							<ActivityIndicator animating={loadingSharedList} style={{padding:15, }} size="large" color={gray} />
						</View> :
						<FlatList data={userAvailabilities}
							renderItem={this._renderItem}
							keyExtractor={(item, index) => index.toString()}
							style={{flexWrap: 'wrap', height: userAvailabilities.length === 0 ? null : 160, paddingVertical: 10, marginLeft: -7}} 
							scrollEnabled={userAvailabilities.legnth === 0}
							ListEmptyComponent={() => (
								<TouchableOpacity onPress={this.refreshData}>
									<View style={{height: 160, justifyContent: 'center', alignItems: 'center'}}>
										<MaterialCommunityIcons size={50}
											name='calendar-search'
											color={gray}/>
										<Text style={{fontFamily: 'Raleway-Bold', color: gray}}>No calendars found</Text> 
										<Text style={{fontFamily: 'Raleway-Regular', color: gray}}>Tap to refresh the calendar info</Text> 
									</View>
								</TouchableOpacity>
							)}
							refreshControl={
								<RefreshControl
									refreshing={this.state.loadingSharedList}
									onRefresh={this.refreshData}
									tintColor={gray}
									colors={[dark_blue, blue]} />
							} />
					}
				</View>

				<View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10, marginTop: 0, paddingHorizontal: 15}}>
					

					<TouchableOpacity onPress={this.removePeople}style={{
						backgroundColor: 'white',
						borderRadius: 5,
						padding: 5,

						...Platform.select({
							ios: {
								shadowColor: '#000000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.3,
								shadowRadius: 3,    
							},
							android: {
								elevation: 4,
							},
						}),}}>
						<Text style={{fontFamily: 'Raleway-Regular', color: gray}}>Delete</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.seeAvailabilities}style={{
						backgroundColor: dark_blue,
						borderRadius: 5,
						padding: 5,
						marginRight: 10,

						...Platform.select({
							ios: {
								shadowColor: '#000000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.3,
								shadowRadius: 3,    
							},
							android: {
								elevation: 4,
							},
						}),}}>
						<Text style={{fontFamily: 'Raleway-Regular', color: white}}>See Availabilities</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.setState({searchModalVisible: true}) }
						style={{
							backgroundColor: 'white',
							borderRadius: 5,
							padding: 5,

							...Platform.select({
								ios: {
									shadowColor: '#000000',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.3,
									shadowRadius: 3,    
								},
								android: {
									elevation: 4,
								},
							}),}}>
						<Text style={{
							fontFamily: 'Raleway-Regular', 
							color: gray
						}}>Add</Text>
					</TouchableOpacity>
				</View>

				<Agenda ref='agenda'
					items={agendaData}
					refreshing={loadingSharedList}
					renderItem={this.renderItem}
					renderEmptyData={this.renderEmptyData}
					rowHasChanged={this.rowHasChanged}
					renderEmptyDate={() => {
						return (<View />);
					}}
					hideKnob={true}
					minDate={moment().startOf('week').format('YYYY-MM-DD')}
					maxDate={moment().endOf('week').format('YYYY-MM-DD')}
					shouldChangeDay={this.shouldChangeDay}
					theme={{agendaKnobColor: dark_blue}}/>

				<Modal isVisible={searchModalVisible}
				avoidKeyboard
					onBackdropPress={() => this.setState({searchModalVisible: false})}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Enter the person's email</Text>

						<TextInput  mode="outlined"
							style={{width: '100%', backgroundColor: white, marginVertical: 15,
								fontFamily: 'Raleway-Regular', 
								color: gray}}
							theme={{colors:{primary: dark_blue}}}
							label='Email'
							value={this.state.text}
							onChangeText={searchText => this.setState({ searchText })}/>

						<View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>

							<TouchableOpacity onPress={() => this.setState({searchModalVisible: false})}>
								<Text style={styles.modalCloseText}>Close</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => {
								this.setState({searchModalVisible: false});
								this.addPerson();
							}}>
								<Text style={styles.modalAddText}>Add</Text>
							</TouchableOpacity>

						</View>
					</View>
				</Modal>

				<Modal isVisible={dataModalVisible}
					onBackdropPress={() => this.setState({dataModalVisible: false})}>
					<View style={{borderRadius: 5, padding: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: white }}>
						<Text>{dataModalText}</Text>
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