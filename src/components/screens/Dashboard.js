import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform } from 'react-native';
import { Agenda } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue, white, dark_blue, black } from '../../styles';
import { setDashboardData } from '../../actions';
import { ReviewEventRoute, SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, SchoolInformationRoute, CourseRoute } from '../../constants/screenNames';
import { getDataforDashboard, sortEventsInDictonary } from '../../services/service';

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
			calendarOpened: false
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
	
	timeToString = (time) => {
		const date = new Date(time);
		return date.toISOString().split('T')[0];
	}
	
	componentDidMount() {
		this.setState({isVisible: true});
		
	}
	componentWillMount() {
		this.setDashboardDataService();
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
		const {optionsOpen} = this.state;
		// let showCloseFab;
		// let currentMonthText = 'jninm';

		// if (calendarOpened) {
		// 	showCloseFab = 
		// 	<View style={styles.closeCalendarView}>
		// 		<FAB
		// 			style={styles.closeCalendarFab}
		// 			small
		// 			theme={{colors:{accent:dark_blue}}}
		// 			icon="close"
		// 			onPress={() => this.refs.agenda.chooseDay(this.refs.agenda.state.selectedDay)} />
		// 	</View>;

		// 	// currentMonthText = null;
		// } else {
		// 	showCloseFab = null;
		// 	// setTimeout(() => currentMonthText = this.refs.agenda.state.selectedDay.clone(), 300);
		// }

		return(
			<Portal.Host style={{flex:1}}>
				<View style={styles.content}>
					<StatusBar translucent={true}
						barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
						backgroundColor={'#166489'} />	

					{/* <View style={styles.calendarBack}>
						<Text style={styles.calendarBackText}>{currentMonthText}</Text>
					</View> */}

					<Agenda ref='agenda'
						items={this.state.items}
						renderItem={this.renderItem}
						renderEmptyData={this.renderEmptyData}
						rowHasChanged={this.rowHasChanged}
						showOnlyDaySelected={true}
						shouldChangeDay={this.shouldChangeDay}
						// onCalendarToggled={() => this.setState({calendarOpened: !calendarOpened})}
					/>

					{/* {showCloseFab} */}

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
											this.props.navigation.navigate(SchoolScheduleRoute);
										}
									} else {
										this.props.navigation.navigate(SchoolInformationRoute, {schoolSchedule: true});
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
				</View>
			</Portal.Host>
		);
	}
}

export default connect()(Dashboard);
