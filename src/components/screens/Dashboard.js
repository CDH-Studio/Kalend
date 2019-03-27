import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform } from 'react-native';
import { Agenda } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue, white, dark_blue } from '../../styles';
import { ReviewEventRoute, SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, SchoolInformationRoute } from '../../constants/screenNames';
import { getDataforDashboard } from '../../services/service';

// let currentMonth = '';

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
							shadowColor: '#000000',
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
			isVisible: false
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	loadItems(day) {
		setTimeout(() => {
			for (let i = -15; i < 85; i++) {
				const time = day.timestamp + i * 24 * 60 * 60 * 1000;
				const strTime = this.timeToString(time);
				if (!this.state.items[strTime]) {
					this.state.items[strTime] = [];
				}
			}
			const newItems = {};
			Object.keys(this.state.items).forEach(key => {
				newItems[key] = this.state.items[key];
			});
			this.setState({
				items: newItems
			});

		}, 1000);
	}

	// changeMonth(item) {
	// 	if (item.date.substr(5, 2) === currentMonth) {
	// 		//do nothing
	// 	} else {
	// 		currentMonth = item.date.substr(5, 2);
	// 	}
	// }
	
	renderItem(item) {
		// this.changeMonth(item);

		return (
			<View style={[styles.item]}>
				<Text style={styles.itemText}>{item.name}</Text>
				<Text style={styles.itemText}>{item.time}</Text>
			</View>
		);
	}
	
	renderEmptyDate() {
		return <View style={styles.noEvents}><Text style={styles.noEventsText}>There's no events for the day.</Text></View>;
	}
	
	rowHasChanged(r1, r2) {
		return r1.name !== r2.name;
	}

	shouldChangeDay(r1, r2) {
		return r1 !== r2;
	}
	
	timeToString(time) {
		const date = new Date(time);
		return date.toISOString().split('T')[0];
	}
	
	componentDidMount() {
		this.setState({isVisible: true});
		getDataforDashboard().then(items => {
			this.setState({items});
		});
	}

	showPopover = () =>{
		this.setState({isVisible: true});
	}
	
	closePopover = () => {
		this.setState({isVisible: false});
	}

	render() {
		const {optionsOpen} = this.state;

		return(
			<Portal.Host style={{flex:1}}>
				<View style={styles.content}>
					<StatusBar translucent={true}
						barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
						backgroundColor={'#166489'} />	
					{/* 
					<View style={styles.calendarBack}>
						<Text style={styles.calendarBackText}>{currentMonth}</Text>
					</View> */}

					<Agenda
						items={this.state.items}
						loadItemsForMonth={this.loadItems.bind(this)}
						renderItem={this.renderItem.bind(this)}
						renderEmptyDate={this.renderEmptyDate.bind(this)}
						rowHasChanged={this.rowHasChanged.bind(this)}
						showOnlyDaySelected={true}
						shouldChangeDay={this.shouldChangeDay.bind(this)}
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
										this.props.navigation.navigate(SchoolScheduleRoute);
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
		);
	}
}

export default connect()(Dashboard);
