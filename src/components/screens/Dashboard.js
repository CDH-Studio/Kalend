import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { FAB, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue } from '../../styles';
import { ReviewEventRoute, SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, SchoolInformationRoute } from '../../constants/screenNames';

/**
 * Dashboard of the application which shows the user's calendar and
 * the differents options they can access.
 */
class Dashboard extends React.PureComponent {

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
	
	renderItem(item) {
		return (
			<View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
		);
	}
	
	renderEmptyDate() {
		return null;
	}
	
	rowHasChanged(r1, r2) {
		return r1.name !== r2.name;
	}
	
	timeToString(time) {
		const date = new Date(time);
		return date.toISOString().split('T')[0];
	}
	
	componentDidMount() {
		this.setState({isVisible: true});
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
						backgroundColor={'#2d6986'} />

					<Agenda
						items={this.state.items}
						loadItemsForMonth={this.loadItems.bind(this)}
						renderItem={this.renderItem.bind(this)}
						renderEmptyDate={this.renderEmptyDate.bind(this)}
						rowHasChanged={this.rowHasChanged.bind(this)}
					/>

					<TouchableOpacity style={styles.button}
						onPress={() => {
							this.props.navigation.navigate(ReviewEventRoute);
						}}>
						<Text style={styles.buttonText}>Create Schedule</Text>
					</TouchableOpacity>

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
