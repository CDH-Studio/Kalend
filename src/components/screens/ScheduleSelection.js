import React from 'react';
import {Platform, StatusBar, View, StyleSheet, ImageBackground, Text, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import { gradientColors, orangeColor, calendarEventColors, calendarEventColorsInside } from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import converter from 'number-to-words';
import { Header } from 'react-navigation';

const containerPadding = 10;
const lineThickness = 1;
const lineColor = '#999';
const lineSpace = 25;
const lineViewHorizontalPadding = 15;
const lineViewLeftPadding = 15;

class ScheduleEvent extends React.Component {

	constructor(props) {
		super(props);

		let width = ((Dimensions.get('window').width - containerPadding * 2 - lineViewHorizontalPadding * 2 - lineViewLeftPadding) / 7);
		let color;
		let colorInside;

		switch (this.props.kind) {
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
			height: (this.props.chunks * lineSpace + this.props.chunks * lineThickness) / 4 - lineThickness - 1,
			width: width - 2,
			left: this.props.day * width + 1,
			top: (this.props.start * lineSpace + this.props.chunks * lineThickness) / 4 + lineThickness + 1,
			color,
			colorInside
		};
	}

	render() {
		const { height, width, left, top, color, colorInside } = this.state;
		return (
			<View style={{borderRadius: 3, 
			borderWidth: 2,
			borderColor: color,
			// opacity: 0.5,
			
				backgroundColor: colorInside, 
				height: height, 
				position: 'absolute', 
				width: width,
				top: top,
				left: left,
					...Platform.select({
						ios: {
							shadowColor: '#000000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.8,
							shadowRadius: 2,    
						},
						android: {
							elevation: 3,
						},
					}) 
					}}>
			</View>
		);
	}
}

class Schedule extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			weekLetters: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			hours: [0, 4, 8, 12, 4, 8, 0],
			ordinal: converter.toWordsOrdinal(this.props.id+1),
			data: this.props.data,
			ai: this.props.ai,
			numOfLines: this.props.numOfLines
		};
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
		const { weekLetters, ordinal, data, numOfLines, hours, ai } = this.state;
		return (
			<View style={{paddingTop: 20}}>
				<Text style={{fontFamily: 'Raleway-Medium', 
					color:'white', 
					fontSize: 18, 
					marginBottom: 10}}>
					{ordinal.charAt(0).toUpperCase() + ordinal.slice(1)} schedule
				</Text>
			<TouchableOpacity onPress={() => this.props.nextScreen()}>

				<View style={{backgroundColor: 'white', 
					...Platform.select({
						ios: {
							shadowColor: '#000000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.8,
							shadowRadius: 2,    
						},
						android: {
							elevation: 5,
						},
					}),
					borderRadius: 3, 
					paddingTop: 5, 
					paddingHorizontal: lineViewHorizontalPadding,
					paddingLeft: lineViewHorizontalPadding + lineViewLeftPadding}}>

					<View style={{flexDirection: 'row', 
						justifyContent: 'space-between', 
						padding: 5, 
						paddingHorizontal:20 }}>
						{
							weekLetters.map((str, id) => {
								return (
									<Text key={id} 
										style={{fontFamily: 'Raleway-Medium', 
										fontSize: 17, }}>
											{str}
									</Text>
								);
							})
						}
					</View>


					<View> 

						<View
							style={{
								borderBottomColor: lineColor,
								borderBottomWidth: lineThickness
							}} />
						
						{ this.createLines(numOfLines) }

						{ data.school.map((info, key) => {
							return  <ScheduleEvent key={key} chunks={info.chunks} day={info.day} start={info.start} kind='school' />;
						})}

						{ data.fixed.map((info, key) => {
							return  <ScheduleEvent key={key} chunks={info.chunks} day={info.day} start={info.start} kind='fixed' />;
						})}

						{ ai.map((info, key) => {
							return  <ScheduleEvent key={key} chunks={info.chunks} day={info.day} start={info.start} kind='ai' />;
						})}

						<View style={{flexDirection: 'column', 
							justifyContent: 'space-between', 
							position: 'absolute',
							paddingBottom: 10,
							marginTop: -13.5,
							marginLeft: -22.5,
							alignItems: 'center'
							}}>
							{
								hours.map((hour, key) => {
									return (
										<Text key={key} style={{paddingVertical: 3.4, opacity: 0.5}}>{hour}</Text>
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

	nextScreen = () => {
		this.props.navigation.navigate('ScheduleSelectionDetails');
	}

	constructor(props) {
		super(props);

		this.state = {
			data: {
				school: [
					{
						chunks: 5,
						day: 1,
						start: 4,
					},
					{
						chunks: 7,
						day: 1,
						start: 12,
					},
					{
						chunks: 6,
						day: 2,
						start: 15,
					},
					{
						chunks: 8,
						day: 3,
						start: 11,
					},
					{
						chunks: 10,
						day: 4,
						start: 7,
					},
				],
				fixed: [
					{
						chunks: 3,
						day: 0,
						start: 8,
					},
					{
						chunks: 6,
						day: 6,
						start: 9,
					},
					{
						chunks: 4,
						day: 5,
						start: 11,
					},
				],
				ai: [
					[
						{
							chunks: 5,
							day: 3,
							start: 6,
						},
					],
					[
						{
							chunks: 5,
							day: 2,
							start: 6,
						},
						{
							chunks: 5,
							day: 5,
							start: 6,
						},
					],
					[
						{
							chunks: 5,
							day: 2,
							start: 6,
						},
						{
							chunks: 5,
							day: 0,
							start: 18,
						},
					]
				]
			}
		};
	}
	
	render() {
		const { data } = this.state;
		return(
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />

					<ScrollView >
							<View style={styles.content}>

								<Text style={styles.description}>Below you will find the best weekly schedules created by the application. In order for the AI to work well, please remove the calendars which you don't like</Text>

								{ data.ai.map((ai, key) => {
									return <Schedule nextScreen={this.nextScreen} ai={ai} data={data} key={key} id={key} numOfLines={6}/>;
								})}
							</View>
					</ScrollView>
				</ImageBackground>
			</LinearGradient>
		);
	}
}


export default ScheduleSelection;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '130%' //Fixes pattern bug
	},
	content: {
		padding: containerPadding,
		paddingTop: StatusBar.currentHeight + Header.HEIGHT + 10,
	},
	description: {
		color: 'white',
		fontFamily: 'Raleway-Regular',
	}
});