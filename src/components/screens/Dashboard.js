import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform } from 'react-native';
import { Agenda } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB, Portal, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue, white, dark_blue, black } from '../../styles';
import { setDashboardData, setNavigationScreen } from '../../actions';
import { ReviewEventRoute, FixedEventRoute, NonFixedEventRoute, SchoolInformationRoute, CourseRoute } from '../../constants/screenNames';
import { getDataforDashboard, sortEventsInDictonary } from '../../services/service';

const moment = require('moment');

/**
 * Dashboard of the application which shows the user's calendar and
 * the differents options they can access.
 */
class Dashboard extends React.PureComponent {


	static navigationOptions = ({navigation}) => ({
		headerRight: (
			<TouchableOpacity onPress={() => navigation.navigate(ReviewEventRoute)}
				style={{flexDirection: 'row', alignItems: 'center', marginRight: 10, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: dark_blue, borderRadius: 5, 
					...Platform.select({
						ios: {
							shadowColor: black,
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.3,
							shadowRadius: 3,    
						},
						android: {
							elevation: 4,
						},
					})
				}}>
				<Text style={{color: white, fontFamily: 'Raleway-Bold'}}>Create </Text>
				<MaterialCommunityIcons size={25}
					name="calendar-multiple-check"
					color={white}/>
			</TouchableOpacity>
		),
	});

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			opened: false,
			optionsOpen: false,
			items: {},
			isVisible: false,
			calendarOpened: false,
			snackbarVisible: false,
			snackbarTime: 3000,
			snackbarText: '',
			showMonth: false,
			month: ''
		};
		updateNavigation('Dashboard', props.navigation.state.routeName);
	}
	
	renderItem(item) {
		return (
			<View style={[styles.item]}>
				<Text style={styles.itemText}>{item.name}</Text>
				<Text style={styles.itemText}>{item.time}</Text>
			</View>
		);
	}

	renderEmptyData = () => {
		return <View>
			<Text style={styles.eventsDayTitle}>Events of the Day</Text>
			
			<View style={styles.noEvents}>
				<Text style={styles.noEventsText}>There's no events for the day.</Text>
			</View>
		</View>;
	}
	
	rowHasChanged = (r1, r2) => {
		return r1.name !== r2.name;
	}

	shouldChangeDay = (r1, r2) => {
		return r1 !== r2;
	}

	getMonth(date) {
		const month = date - 1;
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];
			
		this.setState({ month: monthNames[month], showMonth: true });
	}
	
	timeToString = (time) => {
		const date = new Date(time);
		return date.toISOString().split('T')[0];
	}
	
	componentDidMount() {
		this.setState({isVisible: true});     
		this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				if (store.getState().NavigationReducer.successfullyInsertedEvents) {
					this.setState({
						snackbarText: 'Event(s) successfully added',
						snackbarVisible: true
					});

					this.props.dispatch(setNavigationScreen({successfullyInsertedEvents: null}));
				}
			}
		);
	}

	componentWillMount() {
		this.setDashboardDataService();

		const currentDate = moment();
		const month = currentDate.format('M');
		
		this.getMonth(month);
	}

	componentWillUnmount() {
		this.willFocusSubscription.remove();
	}

	setDashboardDataService = () => {
		getDataforDashboard()
			.then(items => {
				setTimeout(() => {
					let dict = sortEventsInDictonary(items);
					this.props.dispatch(setDashboardData(dict));
					this.setState({items: dict});
				},2000);
			})
			.catch(err => {
				console.log('err', err);
			});
	}


	showPopover = () => {
		this.setState({isVisible: true});
	}
	
	closePopover = () => {
		this.setState({isVisible: false});
	}

	render() {
		const {optionsOpen, calendarOpened, snackbarVisible, snackbarTime, snackbarText, month} = this.state;
		let showCloseFab;
		let showMonthView;

		if (calendarOpened) {
			showCloseFab = 
			<View style={styles.closeCalendarView}>
				<FAB
					style={styles.closeCalendarFab}
					small
					theme={{colors:{accent:dark_blue}}}
					icon="close"
					onPress={() => this.refs.agenda.chooseDay(this.refs.agenda.state.selectedDay)} />
			</View>;
	
			showMonthView = null;

		} else {
			showCloseFab = null;

			showMonthView = 
			<View style={styles.calendarBack}>
				<Text style={styles.calendarBackText}>{month}</Text>
			</View>;
		}

		return(
			<View style={{flex:1}}>
				<Portal.Host>
					<View style={styles.content}>
						<StatusBar translucent={true}
							barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
							backgroundColor={'#166489'} />	

						{showMonthView}

						<Agenda ref='agenda'
							items={this.state.items}
							renderItem={this.renderItem}
							renderEmptyData={this.renderEmptyData}
							onDayChange={(date) => {
								this.getMonth(date.month);
							}}
							onDayPress={(date) => {
								this.getMonth(date.month);
							}}
							rowHasChanged={this.rowHasChanged}
							showOnlyDaySelected={true}
							shouldChangeDay={this.shouldChangeDay}
							theme={{agendaKnobColor: dark_blue}}
							onCalendarToggled={(calendarOpened) => this.setState({calendarOpened})}
						/>

						<FAB.Group
							ref={ref => this.touchable = ref}
							theme={{colors:{accent:blue}}}
							open={optionsOpen}
							icon={optionsOpen ? 'close' : 'add'}
							actions={[
								{icon: 'school',
									label: 'Add School Schedule',
									onPress: () => {
										if (store.getState().SchoolInformationReducer.info) {
											if (store.getState().SchoolInformationReducer.info.info.checked === 'third') {
												this.props.navigation.navigate(CourseRoute);
											} else {
												this.props.navigation.navigate(SchoolInformationRoute, {schoolSchedule: true});
											}
										}
									}
								},
								{icon: 'today',
									label: 'Add Fixed Event',
									onPress: () => this.props.navigation.navigate(FixedEventRoute)},
								{icon: 'face',
									label: 'Add Non-Fixed Event',
									onPress: () => this.props.navigation.navigate(NonFixedEventRoute)},
							]}
							onStateChange={() => this.setState({optionsOpen: !optionsOpen})}
							style={styles.fab} />

						{/* <View>
							<Popover popoverStyle={styles.tooltipView}
								isVisible={this.state.isVisible}
								fromView={this.touchable}
								onClose={() => this.closePopover()}>
								<Feather name="x"
									style={{top:-2.5, right: -2.5, justifyContent: "flex-end"}}
									size={25}
									color={black} />
								<Text style={styles.tooltipText}>I'm the content of this popover!</Text>
							</Popover>
						</View> */}
					</View>
				</Portal.Host>

				{showCloseFab}

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

export default connect()(Dashboard);
