import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform } from 'react-native';
import { Agenda } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, white, dark_blue, black } from '../../styles';
import { setDashboardData, setNavigationScreen } from '../../actions';
import { ReviewEventRoute } from '../../constants/screenNames';
import { getDataforDashboard, sortEventsInDictonary } from '../../services/service';

/**
 * Dashboard of the application which shows the user's calendar and
 * the differents options they can access.
 */
class Dashboard extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			items: {},
			isVisible: false,
			calendarOpened: false,
			snackbarVisible: false,
			snackbarTime: 3000,
			snackbarText: '',
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
		const { snackbarVisible, snackbarTime, snackbarText } = this.state;
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
			<View style={{flex:1}}>
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
						theme={{agendaKnobColor: dark_blue}}
						// onCalendarToggled={() => this.setState({calendarOpened: !calendarOpened})}
					/>

					{/* {showCloseFab} */}
				</View>

				<TouchableOpacity onPress={() => this.props.navigation.navigate(ReviewEventRoute)}
					style={{position:'absolute', bottom: 5, right:5}}>
					<View style={{flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						height: 45,
						width: 110,
						backgroundColor: dark_blue,
						borderRadius: 22.5, 
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
						<Text style={{color: white, fontFamily: 'Raleway-Bold', marginRight: 5}}>Create</Text>
						<MaterialCommunityIcons size={20}
							name="calendar-multiple-check"
							color={white}/>
					</View>
				</TouchableOpacity>

				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => this.setState({snackbarVisible: false})} 
					style={styles.snackbar}
					duration={snackbarTime}>
					{snackbarText}
				</Snackbar>
			</View>
		);
	}
}

export default connect()(Dashboard);
