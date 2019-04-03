import React from 'react';
import { StatusBar, View, Platform, FlatList, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Checkbox, TextInput, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { compareScheduleStyles as styles, white, dark_blue, blue } from '../../styles';
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
		console.log(this.props);
		return (
			<View style={{flexDirection: 'row'}}>
				<Checkbox.Android status={this.props.selected ? 'checked' : 'unchecked'}
					onPress={this._onPress} />
				<TouchableOpacity onPress={this._onPress} >
					<Text>{this.props.name}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

class CompareSchedule extends React.PureComponent {

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

					let busyStringRanges = Object.values(data.calendars).map(value => value.busy).flat(1);

					let ranges = busyStringRanges.map(i => {
						let start = moment(i.start);
						let end = moment(i.end);

						return moment.range(start, end);
					});
					console.log(ranges);

					for (let i = 0; i < ranges.length - 1; i++) {
						for (let j = i+1; j < ranges.length; j++) {
							console.log(i, j, ranges.length, ranges);
							if (ranges[i].overlaps(ranges[j], { adjacent: true })) {
								ranges[i] = ranges[i].add(ranges[j], { adjacent: true });
								ranges.splice(j, 1);
								j = i;
							}
						}
					}

					console.log(data);
					console.log(ranges);

					this.setState({
						dataModalText: JSON.stringify(dates),
						dataModalVisible: true
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

	render() {
		const { userAvailabilities, searchModalVisible, snackbarVisible, snackbarText, snackbarTime, dataModalVisible, dataModalText, loadingSharedList } = this.state;

		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#166489'} />

				<Text>People which you can compare schedules with</Text>

				{ loadingSharedList ? 
					null :
					<FlatList data={userAvailabilities}
						renderItem={this._renderItem}
						keyExtractor={(item, index) => index.toString()}
						extraData={this.state}
						refreshControl={
							<RefreshControl
								refreshing={this.state.loadingSharedList}
								onRefresh={this.refreshData}
								tintColor={dark_blue}
								colors={[dark_blue, blue]}
							/>
						} />
				}

				<ActivityIndicator animating={loadingSharedList} style={{padding:15}} size="large" color={dark_blue} />

				<TouchableOpacity onPress={() => this.setState({searchModalVisible: true}) }>
					<Text>Add</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.removePeople}>
					<Text>Delete</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={this.seeAvailabilities}>
					<Text>See Availabilities</Text>
				</TouchableOpacity>

				<Modal isVisible={searchModalVisible}
					onBackdropPress={() => this.setState({searchModalVisible: false})}>
					<View style={{borderRadius: 5, padding: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: white }}>
						<Text>Search for the person you want</Text>
						<TextInput  mode="outlined"
							style={{width: '100%', backgroundColor: white, marginTop: 15}}
							label='Person'
							value={this.state.text}
							onChangeText={searchText => this.setState({ searchText })}/>
						<TouchableOpacity onPress={() => {
							this.setState({searchModalVisible: false});
							this.addPerson();
						}}>
							<Text>Add</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.setState({searchModalVisible: false})}>
							<Text>Close</Text>
						</TouchableOpacity>
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