import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform, NativeModules } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Snackbar, FAB, Checkbox } from 'react-native-paper';
import Popover from 'react-native-popover-view';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, white, dark_blue, black, statusBarDark, statusBarPopover, semiTransparentWhite } from '../../styles';
import { setDashboardData, setNavigationScreen, setTutorialStatus } from '../../actions';
import { calendarColors, calendarInsideColors } from '../../../config/config';
import { ReviewEventRoute } from '../../constants/screenNames';
import { getStrings } from '../../services/helper';
import { getDataforDashboard, sortEventsInDictonary } from '../../services/service';
import ModalEvent from '../ModalEvent';
import DeleteModal from '../DeleteModal';

const moment = require('moment');

// Enables the LayoutAnimation on Android
const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

LocaleConfig.locales.en = LocaleConfig.locales[''];
LocaleConfig.locales['fr'] = {
	monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
	monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
	dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
	dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

/**
 * Dashboard of the application which shows the user's calendar and
 * the differents options they can access.
 */
class Dashboard extends React.PureComponent {

	defaultLocale = store.getState().SettingsReducer.language;

	strings = getStrings().Dashboard;

	static navigationOptions = ({navigation}) => ({
		headerRight: (
			<TouchableOpacity onPress={() => navigation.navigate(ReviewEventRoute, {title: getStrings().ReviewEvent.title})}
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
				<Text style={{color: white, fontFamily: 'Raleway-Bold', marginRight: 5}}>{getStrings().Dashboard.create}</Text>
				<MaterialCommunityIcons size={25}
					name="calendar-multiple-check"
					color={white}/>
			</TouchableOpacity>
		),
		header: null
	});

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			items: {},
			calendarOpened: false,
			snackbarVisible: false,
			snackbarTime: 3000,
			snackbarText: '',
			showMonth: false,
			month: '',
			modalVisible: false,
			deleteDialogVisible: false,
			shouldShowModal: false,
			modalInfo: {},
			eventsPopover: false,
			knobPopover: false,
			createPopover: false
		};
		updateNavigation('Dashboard', props.navigation.state.routeName);

		LocaleConfig.defaultLocale = this.defaultLocale;
	}
	
	renderItem(item, changeInfo, setState) {
		// let category;

		// if (item.category === 'Course') {
		// 	category = this.props.courseColor;
		// } else if (item.category === 'FixedEvent') {
		// 	category = this.props.fixedEventsColor;
		// } else if (item.category === 'NonFixedEvent') {
		// 	category = this.props.nonFixedEventsColor;
		// } else {
		// 	category = white;
		// }

		// let props = this.props;
		// let strings = this.strings;
		
		return (
			<View style={styles.rowItem}>
				<View style={[styles.item,
					// {backgroundColor: category}
				]}>
					<Checkbox />
					<TouchableOpacity 
						// onPress={() => changeInfo(category, item, props, strings, setState)}
					>
						<View style={{marginLeft:10}}>
							<Text style={styles.itemText}>{item.name}</Text>
							<Text style={styles.itemText}>{item.time}</Text>
						</View>
					</TouchableOpacity>
				</View>
				
			</View>
		);
	}

	renderEmptyData = () => {
		return <View>
			<Text style={styles.eventsDayTitle}>{this.strings.eventsDayTitle}</Text>
			
			<View style={styles.noEvents}>
				<Text style={styles.noEventsText}>{this.strings.noEventsText}</Text>
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
	
	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				this.setState({eventsPopover: !this.props.showTutorial});
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

	dismissModal = () => {
		this.setState({modalVisible: false});
	}

	/**
	 * Goes to the appropriate Edit Screen
	 */
	navigateEditScreen = (editScreen) => {
		let param = {};

		switch(editScreen) {
			case 'Course':
				param.editTitle = getStrings().Course.editTitle;
				break;
			case 'FixedEvent':
				param.editTitle = getStrings().FixedEvent.editTitle;
				break;
			case 'NonFixedEvent':
				param.editTitle = getStrings().NonFixedEvent.editTitle;
				break;
		}

		this.props.navigation.navigate('Edit' + editScreen, param);
	}

	// showDeleteModal = () => {
	// 	this.setState({deleteDialogVisible: true, shouldShowModal: true});
	// }

	// dismissDeleteModal = () => {

	// }

	changeInfo = (category, item, props, strings, setModalInfo) => {
		let categoryColor;
		let lightCategoryColor;
		let categoryIcon;
		let details;
		let editScreen;
		let detailHeight;

		if (category === 'SchoolSchedule') {
			categoryColor = props.courseColor;
			lightCategoryColor = props.insideCourseColor;
			categoryIcon = 'school';
			details = 
				<View style={styles.modalDetailView}>
					<Text style={styles.modalDetailsSubtitle}>{strings.location}</Text>
					<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.location}</Text>
				</View>;
			detailHeight = 45;
			editScreen = 'Course';
		} else if (category === 'FixedEvent') {
			categoryColor = props.fixedEventsColor;
			lightCategoryColor = props.insideFixedEventsColor;
			categoryIcon = 'calendar-today';
			details = 
				<View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.location}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.location}</Text>
					</View>

					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.description}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.description}</Text>
					</View>

					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.recurrence}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.recurrence}</Text>
					</View>
				</View>;
			detailHeight = 80;
			editScreen = 'FixedEvent';
		} else {
			if (item.category === 'NonFixedEvent') {
				categoryColor = props.nonFixedEventsColor;
				lightCategoryColor = props.insideNonFixedEventsColor;
			} else {
				categoryColor = '#ababab';
				lightCategoryColor = '#ababab';
			}
			categoryIcon = 'face';
			details = 
				<View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.recurrence}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.recurrence}</Text>
					</View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.priority}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.priorityLevel}</Text>
					</View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.location}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.location}</Text>
					</View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>{strings.description}</Text>
						<Text style={[styles.modalDetailsText, {color: semiTransparentWhite}]}>{item.description}</Text>
					</View>
				</View>;
			detailHeight = 100;
			editScreen = 'NonFixedEvent';
		}
		
		setModalInfo(
			{
				categoryColor,
				categoryIcon,
				lightCategoryColor,
				details,
				detailHeight,
				editScreen,
				date: item.date,
				time: item.time,
				eventTitle: item.name
			},
			true
		);
	}

	setModalInfo = (modalInfo, modalVisible) => {
		this.setState({
			modalInfo,
			modalVisible
		});
	}

	render() {
		const {calendarOpened, snackbarVisible, snackbarTime, snackbarText, month} = this.state;
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
				<View style={styles.content}>
					<StatusBar translucent={true}
						animated
						barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
						backgroundColor={statusBarDark} />	

					{showMonthView}
					
					<View style={styles.calendar}>
						<Agenda ref='agenda'
							items={this.state.items}
							renderItem={(item) => this.renderItem(item, this.changeInfo, this.setModalInfo)}
							listTitle={'Events of the Day'}
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
							onCalendarToggled={(calendarOpened) => {
								// LayoutAnimation.configureNext(LayoutAnimation.create(400, 'easeInEaseOut', 'opacity'));
								this.setState({calendarOpened}, () => {
									this.forceUpdate();
								});
							}}
						/>
					</View>

					{ 
						calendarOpened ?
							null :
							<TouchableOpacity onPress={() => this.props.navigation.navigate(ReviewEventRoute, {title: getStrings().ReviewEvent.title})}
								style={{position:'absolute', bottom: 13 , right:10}}
								ref='create'>
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

									<Text style={{color: white, fontFamily: 'Raleway-Bold', marginRight: 5}}>{getStrings().Dashboard.create}</Text>

									<MaterialCommunityIcons size={20}
										name="calendar-multiple-check"
										color={white}/>
								</View>
							</TouchableOpacity>
					}
				</View>

				{showCloseFab}

				<Popover popoverStyle={styles.tooltipView}
					isVisible={this.state.eventsPopover}
					onClose={() => this.setState({eventsPopover:false}, () => this.setState({knobPopover:true}))}>
					<TouchableOpacity onPress={() => this.setState({eventsPopover:false}, () => this.setState({knobPopover:true}))}>
						<Text style={styles.tooltipText}>{this.strings.eventsPopover}</Text>
					</TouchableOpacity>
				</Popover>

				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={60}
					fromView={this.refs.agenda}
					isVisible={this.state.knobPopover}
					onClose={() => this.setState({knobPopover:false}, () => this.setState({createPopover:true}))}>
					<TouchableOpacity onPress={() => this.setState({knobPopover:false}, () => this.setState({createPopover:true}))}>
						<Text style={styles.tooltipText}>{this.strings.knobPopover}</Text>
					</TouchableOpacity>
				</Popover>
				
				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={-(StatusBar.currentHeight + 2)}
					isVisible={this.state.createPopover}
					fromView={this.refs.create}
					onClose={() => {
						this.setState({createPopover:false});
						this.props.dispatch(setTutorialStatus('dashboard', true));
					}}>
					<TouchableOpacity onPress={() => {
						this.setState({createPopover:false});
						this.props.dispatch(setTutorialStatus('dashboard', true));
					}}>
						<Text style={styles.tooltipText}>{this.strings.createPopover}</Text>
					</TouchableOpacity>
				</Popover>

				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => this.setState({snackbarVisible: false})} 
					style={styles.snackbar}
					duration={snackbarTime}>
					{snackbarText}
				</Snackbar>

				{/* <ModalEvent visible={this.state.modalVisible}
					dismiss={this.dismissModal}
					navigateEditScreen={this.navigateEditScreen}
					showDeleteModal={this.showDeleteModal}
					categoryColor={this.state.modalInfo.categoryColor}
					eventTitle={this.state.modalInfo.eventTitle}
					date={this.state.modalInfo.date}
					time={this.state.modalInfo.time}
					categoryIcon={this.state.modalInfo.categoryIcon}
					detailHeight={this.state.modalInfo.detailHeight}
					details={this.state.modalInfo.details}
					editScreen={this.state.modalInfo.editScreen} />

				<DeleteModal visible={this.state.deleteDialogVisible}
					dismiss={this.dismissDelete}
					shouldShowModal={this.state.shouldShowModal}
					deleteEvent={this.deleteEvent}
					showModal={this.showModal} /> */}
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	let { fixedEventsColor, nonFixedEventsColor, courseColor } = state.CalendarReducer;
	let insideFixedEventsColor = fixedEventsColor;
	let insideNonFixedEventsColor = nonFixedEventsColor;
	let insideCourseColor = courseColor;

	for (let i = 0; i < calendarColors.length; i++) {
		let key = Object.keys(calendarColors[i])[0];
		let value = Object.values(calendarColors[i])[0];

		switch(key) {
			case fixedEventsColor:
				fixedEventsColor = value;
				insideFixedEventsColor = Object.values(calendarInsideColors[i])[0];
				break;
			
			case nonFixedEventsColor:
				nonFixedEventsColor = value;
				insideNonFixedEventsColor = Object.values(calendarInsideColors[i])[0];
				break;
				
			case courseColor:
				courseColor = value;
				insideCourseColor = Object.values(calendarInsideColors[i])[0];
				break;
		}
	}

	if (!fixedEventsColor) {
		fixedEventsColor = state.CalendarReducer.calendarColor;
	}

	if (!nonFixedEventsColor) {
		nonFixedEventsColor = state.CalendarReducer.calendarColor;
	}

	if (!courseColor) {
		courseColor = state.CalendarReducer.calendarColor;
	}
	
	if (!insideFixedEventsColor) {
		insideFixedEventsColor = state.CalendarReducer.calendarColor;
	}

	if (!insideNonFixedEventsColor) {
		insideNonFixedEventsColor = state.CalendarReducer.calendarColor;
	}

	if (!insideCourseColor) {
		insideCourseColor = state.CalendarReducer.calendarColor;
	}

	return {
		fixedEventsColor,
		nonFixedEventsColor,
		courseColor,
		insideNonFixedEventsColor,
		insideFixedEventsColor,
		insideCourseColor,
		showTutorial: state.SettingsReducer.tutorialStatus.dashboard
	};
};

export default connect(mapStateToProps)(Dashboard);
