import React from 'react';
import { Platform, StatusBar, View, StyleSheet, ImageBackground, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { gradientColors, calendarEventColors, calendarEventColorsInside } from '../../../config';
import { Header } from 'react-navigation';
import { data } from './scheduleInfo';
import LinearGradient from 'react-native-linear-gradient';
import converter from 'number-to-words';
import updateNavigation from '../NavigationHelper';
import { SET_SELECTED_SCHEDULE } from '../../constants';
import {connect} from 'react-redux';

const containerPadding = 10;
const lineThickness = 1;
const lineColor = '#999';
const lineSpace = 25;
const lineViewHorizontalPadding = 15;
const lineViewLeftPadding = 15;

/**
 * The component of an event on a schedule
 * 
 * @prop {String} kind The kind of event (fixed, ai or school)
 * @prop {Integer} chunks The length of the event (1 chunk represents 1 hour)
 * @prop {Integer} day The day the event will take place (0 being Sunday) 
 * @prop {Integer} start The start of the event in terms of the number of chunks
 */
class ScheduleEvent extends React.Component {

	constructor(props) {
		super(props);

		let { startOffset, timeInterval, kind, chunks, start, day } = this.props;

		let width = ((Dimensions.get('window').width - containerPadding * 2 - lineViewHorizontalPadding * 2 - lineViewLeftPadding) / 7);
		let color;
		let colorInside;

		switch (kind) {
			case 'fixed':
				color = calendarEventColors.red;
				colorInside = calendarEventColorsInside.red;
				break;
			case 'school':
				color = calendarEventColors.green;
				colorInside = calendarEventColorsInside.green;
				break;
			case 'ai':
				color = calendarEventColors.purple;
				colorInside = calendarEventColorsInside.purple;
				break;
		}

		this.state = {
			height: (chunks * lineSpace + chunks * lineThickness) / timeInterval - lineThickness - 1,
			width: width - 2,
			left: day * width + 1,
			top: ((start - startOffset)* lineSpace + chunks * lineThickness) / timeInterval + lineThickness + 1,
			color,
			colorInside,
		};
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
				left: left,
				...Platform.select({
					ios: {
						shadowColor: '#000000',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: this.props.showShadow ? 0.8 : 0,
						shadowRadius: 2,    
					},
					android: {
						elevation: this.props.showShadow ? 3 : 0,
					},
				}) }}>
			</View>
		);
	}
}


/**
 * The component of a schedule which contains ScheduleEvents
 * 
 * @prop {Object} data The whole object containing the data
 * @prop {Array} aiIndex The index of ai events in the data ai array
 * @prop {Integer} numOfLines The number of lines to be drawn on the schedule
 * @prop {Integer} id The number of the schedule
 */
class Schedule extends React.Component {

	constructor(props) {
		super(props);

		let ordinal = converter.toWordsOrdinal(this.props.id+1);

		this.state = {
			weekLetters: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			ordinal: ordinal.charAt(0).toUpperCase() + ordinal.slice(1),
			data: this.props.data,
			aiIndex: this.props.id,
			numOfLines: this.props.numOfLines,
			showShadow: true
		};

	}

	componentWillMount() {
		this.createTimes();
	}

	createTimes = () => {
		let hours = [];

		// Gets the earliest and latest hours in the events
		let earliestHour = 12;
		let latestHour = 12;
		Object.entries(data).map((i, index) => {
			if (index === 2) {
				i[1] = i[1][this.state.aiIndex];
			}

			i[1].map((i) => {
				let start = i.start;
				let end = i.start + i.chunks;

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
		if (interval % this.state.numOfLines !== 0) {
			let diff = this.state.numOfLines - interval % this.state.numOfLines;
			interval += diff;

			for (let i = 0; i < diff; i ++) {
				if (i % 2 === 0) {
					if (earliestHour >= 0) {
						earliestHour --;
					} else {
						latestHour ++;
					}
				} else {
					if (latestHour < 24) {
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
		interval = interval / this.state.numOfLines;
		for (let i = 0; i <= this.state.numOfLines; i++) {
			hours.push(currentHour);
			currentHour += interval;
			if (currentHour > 12 || (currentHour >= 12 && count == 1)) {
				currentHour -= 12;
				count ++;
			}
		}		

		this.setState({
			hours,
			startOffset: earliestHour,
			timeInterval: interval
		});
	}

	createLines = (num) => {
		let lines = [];
		for (let i = 0; i < num; i++) {
			lines.push(
				<View key={i}
					style={{
						borderBottomColor: lineColor,
						borderBottomWidth: lineThickness,
						opacity:0.3,
						marginTop: lineSpace ,
						marginBottom: (i === num-1) ? lineSpace / 1.5 : 0
					}}/>
			);
		}
		return lines;
	}

	render() {
		const { weekLetters, ordinal, data, numOfLines, hours, aiIndex, showShadow, startOffset, timeInterval } = this.state;
		return (
			<View style={styles.scheduleContainer}>
				<Text style={styles.title}>
					{ordinal} schedule
				</Text>
				
				<TouchableOpacity onPress={() => {
					this.props.nextScreen(ordinal + ' Schedule');
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
								shadowColor: '#000000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: showShadow ? 0.8 : 0,
								shadowRadius: 2,    
							},
							android: {
								elevation: showShadow ? 5 : 0,
							},
						}),}]}>

						<View style={styles.weekLetterContainer}>
							{ weekLetters.map((str, id) => {
								return (
									<Text key={id} 
										style={styles.weekLetters}>
										{str}
									</Text>
								);
							}) }
						</View>

						<View> 
							<View style={styles.thickLine} />
							
							{ this.createLines(numOfLines) }

							{ data.school.map((info, key) => {
								return  <ScheduleEvent key={key} 
									showShadow={showShadow} 
									chunks={info.chunks} 
									day={info.day} 
									start={info.start} 
									kind='school' 
									timeInterval={timeInterval} 
									startOffset={startOffset} />;
							})}

							{ data.fixed.map((info, key) => {
								return  <ScheduleEvent key={key} showShadow={showShadow} chunks={info.chunks} day={info.day} start={info.start} kind='fixed' timeInterval={timeInterval} startOffset={startOffset} />;
							})}

							{ data.ai[aiIndex].map((info, key) => {
								return  <ScheduleEvent key={key} showShadow={showShadow} chunks={info.chunks} day={info.day} start={info.start} kind='ai' timeInterval={timeInterval} startOffset={startOffset} />;
							})}

							<View style={styles.hoursTextContainer}>
								{ hours.map((hour, key) => {
									return (
										<Text key={key} style={styles.hoursText}>{hour}</Text>
									);
								}) }
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
class ScheduleSelection extends React.Component {
	static navigationOptions = {
		title: 'Schedule Selection',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	constructor(props) {
		super(props);
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}


	nextScreen = (title) => {
		if(this.props.navigation.state.routeName === 'TutorialScheduleSelection') {
			this.props.navigation.navigate('TutorialScheduleSelectionDetails', {title});
		}else {
			this.props.navigation.navigate('DashboardScheduleSelectionDetails', {title});
		}
	}
	
	setIndex(index) {
		this.props.dispatch({
			type:SET_SELECTED_SCHEDULE,
			index,
		});
	}
	
	render() {
		return(
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<ScrollView >
						<View style={styles.content}>

							<Text style={styles.description}>Below you will find the best weekly schedules created by the application. In order for the AI to work well, please remove the calendars which you don't like</Text>

							{ data.ai.map((ai, key) => {
								return <Schedule nextScreen={this.nextScreen} data={data} key={key} id={key} numOfLines={6}/>;
							})}

						</View>
					</ScrollView>

				</ImageBackground>
			</LinearGradient>
		);
	}
}

export default connect()(ScheduleSelection);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '130%'
	},
	content: {
		padding: containerPadding,
		paddingTop: StatusBar.currentHeight + Header.HEIGHT + 10,
	},
	description: {
		color: 'white',
		fontFamily: 'Raleway-Regular',
	},
	hoursTextContainer: {
		flexDirection: 'column', 
		justifyContent: 'space-between', 
		position: 'absolute',
		paddingBottom: 10,
		marginTop: -13.5,
		marginLeft: -22.5,
		alignItems: 'center'
	},
	hoursText: {
		paddingVertical: 3.4, 
		opacity: 0.5
	}, 
	thickLine: {
		borderBottomColor: lineColor,
		borderBottomWidth: lineThickness 
	},
	weekLetters: {
		fontFamily: 'Raleway-Medium', 
		fontSize: 17, 
	}, 
	weekLetterContainer: {
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		padding: 5, 
		paddingHorizontal:20 
	},
	card: {
		backgroundColor: 'white', 
		borderRadius: 3, 
		paddingTop: 5, 
		paddingHorizontal: lineViewHorizontalPadding,
		paddingLeft: lineViewHorizontalPadding + lineViewLeftPadding
	},
	title: {
		fontFamily: 'Raleway-Medium', 
		color:'white', 
		fontSize: 18, 
		marginBottom: 10
	}, 
	scheduleContainer: {
		paddingTop: 20
	}
});