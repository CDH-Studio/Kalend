import React from 'react';
import { Platform, StatusBar, View, BackHandler, Alert, Text, ScrollView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';
import { setSelectedSchedule, deleteGeneratedCalendar, clearGeneratedCalendars, clearGeneratedNonFixedEvents } from '../../actions';
import { calendarColors, calendarInsideColors } from '../../../config/config';
import { DashboardNavigator, ScheduleSelectionDetailsRoute, ReviewEventRoute } from '../../constants/screenNames';
import updateNavigation from '../NavigationHelper';
import converter from 'number-to-words';
import { eventsToScheduleSelectionData } from '../../services/service';
import { scheduleSelectionStyle as styles, black, white } from '../../styles';
import { getStrings } from '../../services/helper';

export const containerPadding = 10;
export const lineThickness = 1;
export const lineColor = '#999';
export const lineSpace = 25;
export const lineViewHorizontalPadding = 15;
export const lineViewLeftPadding = 15;

/**
 * The component of an event on a schedule
 * 
 * @prop {String} kind The kind of event (fixed, ai or school)
 * @prop {Integer} chunks The length of the event (1 chunk represents 1 hour)
 * @prop {Integer} day The day the event will take place (0 being Sunday) 
 * @prop {Integer} start The start of the event in terms of the number of chunks
 * @prop {Boolean} showShadow Shows shadow if true, doesn't otherwise
 * @prop {Integer} timeInterval The number of hours there is between two lines (max 4 hours, min 1 hour)
 * @prop {Boolean} startOffset The number of hours offset if the startTime is not equal to 0
 */
class ScheduleEvent extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0,
			left:0,
			top: 0,
			color: '' ,
			colorInside : ''
		};
	}

	componentWillMount() {
		this.setEventBlock(this.props);
	}
	

	componentWillReceiveProps(props) {
		this.setEventBlock(props);
	}

	setEventBlock = (props) => {
		let windowWidth = ((Dimensions.get('window').width - containerPadding * 2 - lineViewHorizontalPadding * 2 - lineViewLeftPadding) / 7);
		let { startOffset, timeInterval, kind, chunks, start, day } = props;
		let height = (chunks * lineSpace + chunks * lineThickness) / timeInterval - lineThickness - 1;
		let width = windowWidth - 2;
		let left = day * windowWidth + 1;
		let top = ((start - startOffset)* lineSpace + chunks * lineThickness) / timeInterval + lineThickness + 1;
		let color;
		let colorInside;

		// Gets the appropriate color for the event
		switch (kind) {
			case 'fixed':
				color = this.props.colors.fixedEventsColor;
				colorInside = this.props.colors.insideFixedEventsColor;
				break;
			case 'school':
				color = this.props.colors.courseColor;
				colorInside = this.props.colors.insideCourseColor;
				break;
			case 'ai':
				color = this.props.colors.nonFixedEventsColor;
				colorInside = this.props.colors.insideNonFixedEventsColor;
				break;
		}

		this.setState({height,width,left,top,color, colorInside});
	}

	render() {
		const { height, width, left, top, color, colorInside } = this.state;
		return (
			<View style={{ borderRadius: 3, 
				borderWidth: 2,
				position: 'absolute', 
				borderColor: color,
				backgroundColor: colorInside, 
				height: height, 
				width: width,
				top: top,
				left: left,}}>
			</View>
		);
	}
}

/**
 * The component of a schedule which contains ScheduleEvents
 * 
 * @prop {Object} data The whole object containing the data
 * @prop {Function} nextScreen The parent function to go to the next screen
 * @prop {Integer} numOfLines The number of lines to be drawn on the schedule
 * @prop {Integer} id The number of the schedule
 */
class Schedule extends React.PureComponent {
	strings = getStrings().ScheduleSelection;

	constructor(props) {
		super(props);

		// Gets the ordinal word thanks to an existing library and the schedule index
		let ordinal;
		if ('ordinal' in this.strings) {
			ordinal = this.strings.ordinal[this.props.id];
		} else {
			ordinal = converter.toWordsOrdinal(this.props.id+1);
		}

		this.state = {
			weekLetters: this.strings.weekLetters,
			ordinal: ordinal.charAt(0).toUpperCase() + ordinal.slice(1),
			showShadow: true,
			hours: [0, 4, 8, 12, 4, 8, 0],
			startOffset: 0,
			timeInterval: 4,
			ai: [],
			aiEvents: [[]]
		};
	}

	componentWillMount() {
		this.setState({ai: this.props.ai, aiEvents: this.props.aiEvents});
		this.createTimes();
	}

	componentWillReceiveProps(props) {
		this.setState({ai: props.ai, aiEvents: props.aiEvents});
		this.createTimes();
	}

	/**
	 * Creates the time intervals between two lines according to the events that are present in the calendar
	 */
	createTimes = () => {
		let { school, fixed, ai } = this.props;

		if (!Array.isArray(ai)) {
			ai = [ai];
		}

		let data = {school, fixed, ai};

		let hours = [];
		// Gets the earliest and latest hours in the events
		let earliestHour = 12;
		let latestHour = 12;
		Object.entries(data).map((i) => {
			i[1].map((i) => {
				let start = i.start;
				let end = i.start + Math.ceil(i.chunks);

				if (start < earliestHour) {
					earliestHour = start;
				}

				if (end > latestHour) {
					latestHour = end;
				}
			});
		});
		// If the range of the earliest and latest hours divided by the number of lines 
		// is odd, change it to be event
		let interval = (latestHour - earliestHour);
		if (interval % this.props.numOfLines !== 0) {
			let diff = this.props.numOfLines - interval % this.props.numOfLines;
			interval += diff;

			for (let i = 0; i < diff; i ++) {
				if (i % 2 === 0) {
					if (earliestHour >= 0) {
						earliestHour --;
					} else {
						latestHour ++;
					}
				} else {
					if (latestHour <= 24) {
						latestHour ++;
					} else {
						earliestHour --;
					}
				}
			}
		}

		// Creates the hours on the side
		let currentHour = earliestHour;
		let count = 0;
		interval = interval / this.props.numOfLines;
		for (let i = 0; i <= this.props.numOfLines; i++) {
			hours.push(currentHour);
			currentHour += interval;
			if (currentHour > 12 || (currentHour >= 12 && count == 1)) {
				currentHour -= 12;
				count ++;
			}
		}	
		
		// Saves the information in the state
		this.setState({
			hours,
			startOffset: earliestHour,
			timeInterval: interval
		});
	}

	/**
	 * Helper method to create the lines dynamically
	 * 
	 * @param {Integer} num The number of lines to be displayed on the schedule
	 */
	createLines = (num) => {
		let lines = [];
		for (let i = 0; i < num; i++) {
			lines.push(
				<View key={i}
					style={[styles.line, {
						marginBottom: (i === num-1) ? lineSpace / 1.5 : 0
					}]}/>
			);
		}
		return lines;
	}

	render() {
		const { numOfLines, id, colors } = this.props;
		// console.log('data in render', id, data.ai[id]);
		const { weekLetters, ordinal, hours, showShadow, startOffset, timeInterval } = this.state;

		return (
			<View style={styles.scheduleContainer}>
				<Text style={styles.title}>
					{ordinal + ' ' + this.strings.schedule}
				</Text>
				
				{/* The onPressIn and onPressOut helps eliminating the weird
					effect when shadows are on and you touch a schedule */}
				<TouchableOpacity onPress={() => {
					this.props.nextScreen(ordinal + ' ' + (this.props.language === 'en' ? (this.strings.schedule[0].toUpperCase() + this.strings.schedule.slice(1)) : this.strings.schedule), id, {
						fixed: this.props.fixed,
						school: this.props.school,
						ai: this.state.ai,
						aiEvents: this.state.aiEvents,
						fixedEvents: this.props.fixedEvents,
						schoolEvents: this.props.schoolEvents
					});
				}} 
				onPressIn={() =>{
					this.setState({
						showShadow: false
					});
				}}
				onPressOut={() => {
					setTimeout(()=>{
						this.setState({
							showShadow: true
						});
					}, 900);
				}}>

					<View style={[styles.card, {
						...Platform.select({
							ios: {
								shadowColor: black,
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: showShadow ? 0.4 : 0,
								shadowRadius: 5,    
							},
							android: {
								elevation: showShadow ? 5 : 0,
							},
						}),}]}>

						<View style={styles.weekLetterContainer}>
							{ 
								weekLetters.map((str, id) => {
									return (
										<Text key={id} 
											style={styles.weekLetters}>
											{str}
										</Text>
									);
								}) 
							}
						</View>

						<View> 
							<View style={styles.thickLine} />
							
							{ this.createLines(numOfLines) }

							{ 
								this.props.school.map((info, key) => {
									return  <ScheduleEvent key={key} 
										colors={colors}
										showShadow={showShadow} 
										chunks={info.chunks} 
										day={info.day} 
										start={info.start} 
										kind='school' 
										timeInterval={timeInterval} 
										startOffset={startOffset} />;
								})
							}

							{ 
								this.props.fixed.map((info, key) => {
									return  <ScheduleEvent key={key} 
										colors={colors}
										showShadow={showShadow} 
										chunks={info.chunks} 
										day={info.day} 
										start={info.start} 
										kind='fixed' 
										timeInterval={timeInterval} 
										startOffset={startOffset} />;
								})
							}

							{ 
							
								this.state.ai.map((info, key) => {
									return  <ScheduleEvent key={key} 
										colors={colors}
										showShadow={showShadow} 
										chunks={info.chunks} 
										day={info.day} 
										start={info.start} 
										kind='ai' 
										timeInterval={timeInterval} 
										startOffset={startOffset} />;
								})
									
							}

							<View style={styles.hoursTextContainer}>
								{ 
									hours.map((hour, key) => {
										return (
											<Text key={key} 
												style={styles.hoursText}>
												{hour}
											</Text>
										);
									}) 
								}
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}



/**
 * The component which encloses all of the schedules which has been generated
 */
class ScheduleSelection extends React.PureComponent {
	strings = getStrings().ScheduleSelection;

	static navigationOptions = ({ navigation }) => ({
		title: getStrings().ScheduleSelection.title,
		gesturesEnabled: false,
		headerLeft: <HeaderBackButton tintColor={white} onPress={() => {
			navigation.getParam('onBackPress')(); 
		}} />,
	});

	constructor(props) {
		super(props);
		this.state = {
			data: {
				school: [],
				fixed: [],
				ai: [],
				aiCalendars: [[]]
			}
		};

		// Updates the navigation location in redux
		updateNavigation('ScheduleSelection',  props.navigation.state.routeName);
	}

	componentWillMount() {
		this.eventsToScheduleSelectionService();
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.props.navigation.setParams({onBackPress: this.handleBackButton});
	}

	
	deleteCalendar = (index) => {
		let data = this.state.data;
		data.ai.splice(index,1);
		this.props.dispatch(deleteGeneratedCalendar(index));
		this.setState({data});
		this.forceUpdate();
	}

	eventsToScheduleSelectionService = () => {
		eventsToScheduleSelectionData().then((data) => {
			this.setState({data});
		});
	}


	handleBackButton = () => {
		Alert.alert(
			this.strings.backAlertTitle,
			this.strings.backAlertDescription,
			[
				{
					text: this.strings.cancel,
					style: 'cancel',
				},
				{
					text: getStrings().Dashboard.name,
					onPress: () => {
						this.props.navigation.navigate(DashboardNavigator);
						this.props.dispatch(clearGeneratedCalendars());
						this.props.dispatch(clearGeneratedNonFixedEvents());
					}
				},
				{
					text: getStrings().ReviewEvent.name, 
					onPress: () => {
						this.props.navigation.navigate(ReviewEventRoute, {title: getStrings().ReviewEvent.title});
						this.props.dispatch(clearGeneratedCalendars());
						this.props.dispatch(clearGeneratedNonFixedEvents());
					},
				},
			],
			{cancelable: true},
		);
		return true;
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	/**
	 * Goes to the next screen
	 * 
	 * @param {String} title The header title for the next screen
	 * @param {Integer} index The index of the selected school schedule
	 * @param {Object} data The data  of all events to be displaced on TutorialScheduleSelectionDetails screen
	 */
	nextScreen = (title, index, data) => {
		this.setIndex(index);
		this.props.navigation.navigate(ScheduleSelectionDetailsRoute, {title, data, delete: this.deleteCalendar});
	}
	
	/**
	 * Saves the information about the selected school schedule in redux
	 * 
	 * @param {Integer} index The index of the selected school schedule
	 */
	setIndex = (index) => {
		this.props.dispatch(setSelectedSchedule(index));
	}

	
	_renderItem = ({item, index}) => {
		return <Schedule nextScreen={this.nextScreen} 
			colors={{
				courseColor: this.props.courseColor,
				fixedEventsColor: this.props.fixedEventsColor,
				nonFixedEventsColor: this.props.nonFixedEventsColor,
				insideFixedEventsColor: this.props.insideFixedEventsColor,
				insideNonFixedEventsColor: this.props.insideNonFixedEventsColor,
				insideCourseColor: this.props.insideCourseColor,
			}}
			fixed={this.state.data.fixed}
			school={this.state.data.school}
			ai={item}
			aiEvents={this.state.data.aiCalendars[index]}
			fixedEvents={this.state.data.fixedEvents}
			schoolEvents={this.state.data.schoolEvents}
			id={index}
			numOfLines={6}
			language={this.props.language} />;
	};

	render() {
		return(

			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'rgba(0, 0, 0, 0.5)'} />

				<ScrollView >
					<View style={styles.content}>
						<Text style={styles.description}>{this.strings.description}</Text>
						<View style={styles.legendRow}>
							<View style={styles.singleLegend}>
								<View style={[styles.legendColor, {borderColor: this.props.courseColor, backgroundColor: this.props.insideCourseColor}]}></View>
								<Text style={styles.legendText}>{this.strings.courses}</Text>
							</View>
							<View style={styles.singleLegend}>
								<View style={[styles.legendColor, {borderColor: this.props.fixedEventsColor, backgroundColor: this.props.insideFixedEventsColor}]}></View>
								<Text style={styles.legendText}>{this.strings.fixedEvents}</Text>
							</View>
							<View style={styles.singleLegend}>
								<View style={[styles.legendColor, {borderColor: this.props.nonFixedEventsColor, backgroundColor: this.props.insideNonFixedEventsColor}]}></View>
								<Text style={styles.legendText}>{this.strings.nonFixedEvents}</Text>
							</View>
						</View>
						{
							this.state.data.ai.length >= 1 ? 
								<FlatList data={this.state.data.ai}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this._renderItem} /> : null
						}
					</View>
				</ScrollView>
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
		language: state.SettingsReducer.language
	};
};

export default connect(mapStateToProps, null)(ScheduleSelection);