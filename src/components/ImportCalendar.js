import React from 'react';
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { importCalendarStyles as styles, dark_blue, gray } from '../styles';
import { getCalendarList, listEvents, insertEvent } from '../services/google_calendar';
import { Checkbox } from 'react-native-paper';

class ImportCalendar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			visible: props.visible,
			data: [],
			selected: (new Map()),
			totalEvents: 0,
			doneEvents: 0,
			progressVisible: false,
			showProgress: false,
			endProgressText: '',
			loading: true,
			noEvents: false
		};
	}

	componentWillMount() {
		this.getCalendars();
	}

	/**
	 * Gets the new value of visible and updates it in the props
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			visible: newProps.visible,
		});
	}

	/**
	 * Dismisses the modal
	 */
	removeModal = () => {
		// this.importEvents();
		this.setState({ visible: false });
		// this.props.dismiss();
	}

	getCalendars = async () => {
		this.setState({loading: true});

		let data = await getCalendarList();

		// Only shows calendar in which the user is owner of and removes the Kalend calendar from the list
		data = data.items.filter(i => i.accessRole === 'owner' && i.id !== this.props.calendarId);

		// Cleans the data
		data = data.reduce((acc, i) => {
			acc.push({
				id: i.id,
				title: i.summary,
				color: i.backgroundColor,
			});

			return acc;
		}, []);

		this.setState({data, loading: false});
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

	_renderItem = ({item, index}) => {
		let status = !!this.state.selected.get(index);
		return (
			<View style={styles.itemView}>
				<Checkbox.Android value={index} 
					uncheckedColor={item.color}
					color={item.color} 
					onPress={() => this._onPressItem(index)}
					status={status ? 'checked' : 'unchecked'}/>

				<TouchableOpacity onPress={() => this._onPressItem(index)}>
					<Text style={styles.itemText}>{item.title}</Text>
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 * Returns a list of calendarIds that are selected from the flatList
	 */
	getListIdSelected = () => {
		let selectedValue = [];

		for (const entry of this.state.selected.entries()) {
			if (entry[1]) {
				selectedValue.push(this.state.data[entry[0]].id);
			}
		}

		return selectedValue;
	}

	importEvents = async () => {
		let selectedCalendars = this.getListIdSelected();

		let data = await Promise.all(
			selectedCalendars.map(id => {
				return new Promise((resolve, reject) => {
					listEvents(id)
						.then(data => resolve(data.items))
						.catch(err => reject(err));
				});
			}));

		data = data.flat(1);
		console.log(data);

		data = data.reduce((acc, i) => {
			delete i.updated;
			delete i.created;
			delete i.creator;
			delete i.etag;
			delete i.htmlLink;
			delete i.kind;
			delete i.iCalUID;
			delete i.id;
			delete i.attendees;

			acc.push(i);

			return acc;
		}, []);

		this.setState({
			totalEvents: data.length,
			doneEvents: 0,
			noEvents: data.length === 0
		});


		if (data.length !== 0) {
			let promises = [];
			promises = data.map(event => {
				return new Promise((resolve, reject) => {
					insertEvent(this.props.calendarId, event)
						.then(data => {
							this.setState({doneEvents: this.state.doneEvents + 1});
							resolve(data);
						})
						.catch(err => reject(err));
				});
			});

			Promise.all(promises)
				.then(data => {
					this.setState({endProgressText: 'Calendar' + (selectedCalendars.length > 1 ? 's' : '') + ' successfully imported!'});
					setTimeout(() => {
						this.setState({progressVisible: false});
					}, 3000);
				})
				.catch(err => this.setState({endProgressText: 'Imported some of the calendar events'}));
		} else {
			this.setState({endProgressText: 'No events found in the selected calendar' + (selectedCalendars.length > 1 ? 's' : '')});
			setTimeout(() => {
				this.setState({progressVisible: false});
			}, 3000);
		}

		this.setState({
			visible: false,
			showProgress: true
		});
	}

	render() {
		const { visible, data, doneEvents, totalEvents, progressVisible, showProgress, endProgressText, loading, noEvents } = this.state;

		return(
			<View style={styles.container}>
				<Modal isVisible={visible}
					onBackdropPress={this.removeModal}
					useNativeDriver
					onModalHide={() => {
						if (showProgress) {
							this.setState({progressVisible: true});
						}
					}}>
					<View style={styles.modalContent}>
						<Text style={styles.title}>Select Calendars to Import</Text>

						<Text style={styles.description}>
							{
								loading ? 
									'Fetching your calendar information' :
									'Found ' + data.length + ' calendar' + (data.length > 1 ? 's' : '')
							}
						</Text>

						{	loading ?
							<View style={styles.activityIndicatorContainer}>
								<ActivityIndicator animating={loading} 
									size="large" 
									color={gray} />
							</View> :
							<FlatList data={data}
								style={styles.flatlist}
								showsVerticalScrollIndicator={true} 
								renderItem={this._renderItem}
								extraData={this.state}
								keyExtractor={(item, index) => index.toString()} 
								scrollEnabled={data.length !== 0}
								ListEmptyComponent={() => (
									<TouchableOpacity onPress={this.getCalendars}>
										<View style={styles.emptyContainer}>
											<MaterialCommunityIcons size={50}
												name='calendar-search'
												color={gray}/>
											<Text style={styles.emptyTitle}>No calendars found</Text> 
											<Text style={styles.emptyDescription}>Tap to refresh the calendar info</Text> 
										</View>
									</TouchableOpacity>
								)}
								refreshControl={
									<RefreshControl
										refreshing={loading}
										onRefresh={this.getCalendars}
										tintColor={gray}
										colors={[dark_blue]} />
								}/>
						}

						<View style={styles.buttons}>
							<TouchableOpacity onPress={this.removeModal}>
								<Text style={styles.buttonCancelText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={this.importEvents}>
								<Text style={styles.buttonText}>Import</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<Modal isVisible={progressVisible}
					useNativeDriver>
					<View style={styles.modalContent}>
						<Text style={styles.title}>Importing Selected Calendar</Text>
						{
							(totalEvents !== 0 || noEvents) && totalEvents === doneEvents ? 
								<Text style={{fontFamily: 'Raleway-Regular', color: gray, paddingTop: 10}}>{endProgressText}</Text>:
								<View>
									<Text style={{fontFamily: 'Raleway-Regular', color: gray, paddingVertical: 10}}>Number of events imported {doneEvents} out of {totalEvents}</Text>
								
									<Progress.Bar style={{alignSelf:'center'}} 
										indeterminate={false} 
										progress={totalEvents === 0 ? 0 : doneEvents/totalEvents}
										width={200} 
										color={dark_blue} 
										useNativeDriver={true} 
										unfilledColor={'#79A7D2'} />
								</View>
						}

					</View>
				</Modal>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		calendarId: state.CalendarReducer.id
	};
};

export default connect(mapStateToProps)(ImportCalendar);