import React from 'react';
import { StatusBar, ScrollView, View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import Popover from 'react-native-popover-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import EventOverview from '../EventOverview';
import { bindActionCreators } from 'redux';
import { storeGeneratedCalendars } from '../../services/api/storage_services';
import { deleteCourse, deleteFixedEvent, deleteNonFixedEvent, clearGeneratedCalendars, clearGeneratedNonFixedEvents, clearCourse, clearFixedEvents, setNavigationScreen, setTutorialStatus } from '../../actions';
import { SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, ScheduleCreationRoute, SchoolInformationRoute, CourseRoute, UnavailableRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import { store } from '../../store';
import { reviewEventStyles as styles, white, blue, statusBlueColor, statusBarPopover, statusBarDark, black, dark_blue } from '../../styles';
import { insertFixedEventsToGoogle } from '../../services/service';
import { getStrings } from '../../services/helper';

/**
 * Permits users to verify and edit the events they added
 */
class ReviewEvent extends React.PureComponent {

	strings = getStrings().ReviewEvent;
	priorityLevels = {
		0: this.strings.low,
		0.5: this.strings.normal,
		1: this.strings.high
	};

	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.state.params.title,
			headerStyle: {
				backgroundColor: white,
			},
			headerRight: (
				<TouchableOpacity onPress={() => navigation.navigate(UnavailableRoute, {title: getStrings().UnavailableHours.title})}
					style={{marginRight: 10, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: dark_blue, borderRadius: 5, 
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
					<MaterialCommunityIcons size={25}
						name="clock-alert-outline"
						color={white}/>
				</TouchableOpacity>
			),
		};
	};
		

	constructor(props) {
		super(props);

		this.state = {
			showFAB: true,
			currentY: 0,
			fixedEventData: [],
			nonFixedEventData: [],
			schoolScheduleData: [],
			coursePopover: false,
			fixedPopover: false,
			nonFixedPopover: false,
			unavailablePopover: false,
			checkPopover: false

		};

		updateNavigation('ReviewEvent', props.navigation.state.routeName);
	}

	componentWillMount() {
		this.updateInformation();
	}

	componentDidMount() {
		this.setState({coursePopover: !this.props.showTutorial});
	}

	componentWillReceiveProps() {
		this.updateInformation();
		this.forceUpdate();
	}

	updateInformation = () => {
		let fixedEventData = [];
		let nonFixedEventData = [];
		let schoolScheduleData = [];

		if (store.getState().CoursesReducer !== undefined) {
			store.getState().CoursesReducer.map((data) => {
				let hours;

				if (data.startTime === undefined) {
					hours = `${data.hours[0][0]}:${data.hours[0][1]} ${data.hours[0][2]} - ${data.hours[1][0]}:${data.hours[1][1]} ${data.hours[1][2]}`;
				} else {
					hours = data.startTime + ' - ' + data.endTime;
				}

				let dayOfWeek;
				let fr = 'daysEn' in this.strings;

				if (data.day) {
					dayOfWeek = data.day;
				} else {
					dayOfWeek = data.dayOfWeekValue;
				}

				if (fr) {
					dayOfWeek = this.strings.days[this.strings.daysEn.indexOf(dayOfWeek)];
				}

				schoolScheduleData.push({
					courseCode: data.summary || data.courseCode,
					dayOfWeek,
					hours,
					location: data.location
				});
			});
		}

		if (store.getState().FixedEventsReducer !== undefined) {
			store.getState().FixedEventsReducer.map((data) => {
				fixedEventData.push({
					title: data.title,
					dates: data.startDate + ' - ' + data.endDate,
					recurrence: data.recurrenceValue,
					hours: data.allDay ? this.strings.allDay : (data.startTime + ' - ' + data.endTime),
					location: data.location,
					description: data.description
				});
			});
		}

		if (store.getState().NonFixedEventsReducer !== undefined) {
			store.getState().NonFixedEventsReducer.map((data) => {
				nonFixedEventData.push({
					title: data.title,
					location: data.location,
					priorityLevel: this.priorityLevels[data.priority],
					dates: data.specificDateRange ? (`${data.startDate} - ${data.endDate}`): this.strings.week,
					description: data.description,
					occurence: `${data.occurrence} ${this.strings.timeWeek}`,
					duration: `${data.hours}h ${data.minutes}m`
				});
			});
		}

		this.setState({
			fixedEventData,
			nonFixedEventData,
			schoolScheduleData
		});
	}
	
	deleteEvent = (id, category) => {
		let dataToDispatch;
		let newEvents = [];
		let objectToChange;

		switch (category) {
			case SchoolScheduleRoute:
				dataToDispatch = deleteCourse(id);
				newEvents = this.state.schoolScheduleData;
				objectToChange = 'schoolScheduleData';
				break;
			case FixedEventRoute:
				dataToDispatch = deleteFixedEvent(id);
				newEvents = this.state.fixedEventData;
				objectToChange = 'fixedEventData';
				break;
			case NonFixedEventRoute:
				dataToDispatch = deleteNonFixedEvent(id);
				newEvents = this.state.nonFixedEventData;
				objectToChange = 'nonFixedEventData';
				break;
				
			default:
				break;
		}

		newEvents = newEvents.filter((event,index) => {
			if (index != id) return event;
		});

		this.props.dispatch(dataToDispatch);
		this.setState({[objectToChange]: newEvents});
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

	/**
	 * Goes to the appropriate Schedule Creation Screen
	 */
	navigateCreationScreen = () => {
		this.props.clearGeneratedCalendars();
		this.props.clearGeneratedNonFixedEvents();

		if (this.state.schoolScheduleData.length == 0 && this.state.nonFixedEventData.length == 0 && this.state.fixedEventData.length == 0 ) {
			Alert.alert(
				this.strings.error,
				this.strings.noEvent,
				[
					{text: this.strings.ok},
				],
				{cancelable: false}
			);
			return;
		}
		
		insertFixedEventsToGoogle()
			.then((promises) => {
			
				if (this.state.nonFixedEventData.length == 0) {
					storeGeneratedCalendars(promises).then(success => {
						if(success) {
							this.props.clearCourse();
							this.props.clearFixedEvents();
							this.props.setNavigationScreen({successfullyInsertedEvents: true});
							this.props.navigation.pop();
						}
					});
				} else {
					this.props.navigation.navigate(ScheduleCreationRoute, {title: getStrings().ScheduleCreation.title});	
				}			
			})
			.catch(err => {
				console.log('err', err);
				if (err) {
					Alert.alert(
						this.strings.error,
						err,
						[
							{text: this.strings.ok},
						],
						{cancelable: false}
					);
				}
			});
	}

	showPopover = (isVisible) => {
		this.setState({[isVisible]: true});
		StatusBar.setBackgroundColor(statusBarPopover);
	}
	
	closePopover = (toClose, toOpen) => {
		this.setState({[toClose]:false}, () => this.setState({[toOpen]:true}));
		StatusBar.setBackgroundColor(statusBarDark);
	}

	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true}
					animated
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBlueColor} />

				<ScrollView style={styles.scrollView}>
					<View style={styles.content}>
						<View>
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>{this.strings.courseTitle}</Text>
								
								<TouchableOpacity ref='course' onPress={() => {
									if (this.props.hasSchoolInformation) {
										if (this.props.checked) {
											this.props.navigation.navigate(CourseRoute, {addTitle: getStrings().Course.addTitle});
										} else {
											this.props.navigation.navigate(SchoolScheduleRoute, {title: getStrings().SchoolSchedule.title});
										}
									} else {
										this.props.navigation.navigate(SchoolInformationRoute, {title: getStrings().SchoolInformation.title, reviewEvent: true});
									}
								}}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.schoolScheduleData.length === 0 ?
									<Text style={styles.textNoData}>{this.strings.noCourse}</Text> : 
									this.state.schoolScheduleData.map((i,key) => {
										return <EventOverview key={key}
											id={key}
											category={'SchoolSchedule'}
											eventTitle={i.courseCode}
											date={i.dayOfWeek}
											time={i.hours}
											location={i.location}
											navigateEditScreen={this.navigateEditScreen}
											action={this.deleteEvent} />;
									})
							}
						</View>

						<View>
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>{this.strings.fixedTitle}</Text>
								<TouchableOpacity ref='fixed' onPress={() => this.props.navigation.navigate(FixedEventRoute, {addTitle: getStrings().FixedEvent.addTitle})}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.fixedEventData.length === 0 ?
									<Text style={styles.textNoData}>{this.strings.noFixed}</Text> : 
									this.state.fixedEventData.map((i,key) => {
										return <EventOverview key={key}
											id={key}
											category={'FixedEvent'}
											eventTitle={i.title}
											date={i.dates}
											time={i.hours}
											location={i.location}
											description={i.description}
											recurrence={i.recurrence}
											navigateEditScreen={this.navigateEditScreen}
											action={this.deleteEvent} />;
									})
							}
						</View>

						<View>
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>{this.strings.nonFixedTitle}</Text>
								
								<TouchableOpacity ref='nonFixed' onPress={() => this.props.navigation.navigate(NonFixedEventRoute, {addTitle: getStrings().NonFixedEvent.addTitle})}>
									<MaterialCommunityIcons name="plus-circle" 
										size={25} 
										color={blue}/>
								</TouchableOpacity>
							</View>

							{
								this.state.nonFixedEventData.length === 0 ?
									<Text style={styles.textNoData}>{this.strings.noNonFixed}</Text> : 
									this.state.nonFixedEventData.map((i,key) => {
										return <EventOverview key={key}
											id={key} 
											category={'NonFixedEvent'} 
											eventTitle={i.title} 
											date={i.dates} 
											time={i.duration} 
											recurrence={i.occurence} 
											priorityLevel={i.priorityLevel} 
											location={i.location} 
											description={i.description} 
											navigateEditScreen={this.navigateEditScreen}
											action={this.deleteEvent}
										/>;
									})
							}
						</View>
					</View>		
				</ScrollView>

				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={-(StatusBar.currentHeight)}
					placement={'bottom'}
					isVisible={this.state.coursePopover}
					fromView={this.refs.course}
					onClose={() => this.setState({coursePopover:false}, () => this.setState({fixedPopover:true}))}>
					<TouchableOpacity onPress={() => this.setState({coursePopover:false}, () => this.setState({fixedPopover:true}))}>
						<Text style={styles.tooltipText}>{this.strings.coursePopover}</Text>
					</TouchableOpacity>
				</Popover>

				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={-(StatusBar.currentHeight)}
					placement={'bottom'}
					isVisible={this.state.fixedPopover}
					fromView={this.refs.fixed}
					onClose={() => this.setState({fixedPopover:false}, () => this.setState({nonFixedPopover:true}))}>
					<TouchableOpacity onPress={() => this.setState({fixedPopover:false}, () => this.setState({nonFixedPopover:true}))}>
						<Text style={styles.tooltipText}>{this.strings.fixedPopover}</Text>
					</TouchableOpacity>
				</Popover>

				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={-(StatusBar.currentHeight)}
					placement={'bottom'}
					isVisible={this.state.nonFixedPopover}
					fromView={this.refs.nonFixed}
					onClose={() => this.setState({nonFixedPopover:false}, () => this.setState({unavailablePopover:true}))}>
					<TouchableOpacity onPress={() => this.setState({nonFixedPopover:false}, () => this.setState({unavailablePopover:true}))}>
						<Text style={styles.tooltipText}>{this.strings.nonFixedPopover}</Text>
					</TouchableOpacity>
				</Popover>

				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={-(StatusBar.currentHeight + 57)}
					placement={'bottom'}
					isVisible={this.state.unavailablePopover}
					fromView={this.refs.course}
					onClose={() => this.setState({unavailablePopover:false}, () => this.setState({checkPopover:true}))}>
					<TouchableOpacity onPress={() => this.setState({unavailablePopover:false}, () => this.setState({checkPopover:true}))}>
						<Text style={styles.tooltipText}>{this.strings.unavailablePopover}</Text>
					</TouchableOpacity>
				</Popover>

				<Popover popoverStyle={styles.tooltipView}
					verticalOffset={-(StatusBar.currentHeight)}
					isVisible={this.state.checkPopover}
					fromView={this.refs.check}
					onClose={() => {
						this.setState({checkPopover:false});
						this.props.dispatch(setTutorialStatus('reviewEvents', true));
					}}>
					<TouchableOpacity onPress={() => {
						this.setState({checkPopover:false});
						this.props.dispatch(setTutorialStatus('reviewEvents', true));
					}}>
						<Text style={styles.tooltipText}>{this.strings.checkPopover}</Text>
					</TouchableOpacity>
				</Popover>

				<FAB ref='check' 
					style={styles.fab}
					icon="check"
					theme={{colors:{accent:blue}}}
					visible={this.state.showFAB}
					onPress={this.navigateCreationScreen} />
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { FixedEventsReducer, NonFixedEventsReducer, CoursesReducer, NavigationReducer, SchoolInformationReducer } = state;

	return {
		FixedEventsReducer,
		NonFixedEventsReducer,
		CoursesReducer, 
		selectedIndex: NavigationReducer.reviewEventSelected,
		hasSchoolInformation: SchoolInformationReducer.info,
		checked: SchoolInformationReducer.info && SchoolInformationReducer.info.info.checked === 'third',
		showTutorial: state.SettingsReducer.tutorialStatus.reviewEvents
	};
}


let mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ clearGeneratedNonFixedEvents, clearGeneratedCalendars, clearCourse, clearFixedEvents, setNavigationScreen}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewEvent);