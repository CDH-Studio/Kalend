import { StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Header } from 'react-navigation';
import { HEIGHT } from './components/TutorialStatus';

export const white = '#FFFFFF';
export const black = '#000';
export const blue = '#1473E6';
export const statusBlueColor = '#105DBA';
export const dark_blue = '#0E4BAA';
export const lightOrange = '#FFBF69';
export const orange = '#FF9F1C';
export const imageRollCheck = '#764D16';
export const darkOrange = '#FF621C';
export const red = '#B80000';
export const statusBarDark = '#00000050';
export const gray = '#565454';


export const loadingStyles = StyleSheet.create({
	container: {
		flex: 1,
	},

	animView: {
		position:'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		height:'100%',
		width:'100%'
	},
	
	anim: {
		height:350, 
		width:350,
		flex: 1,
		alignSelf:'center' 
	}
});

export const welcomeStyles = StyleSheet.create({
	mainContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		height: Dimensions.get('window').height + StatusBar.currentHeight,
		width: Dimensions.get('window').width
	},

	image: {
		width: 320,
		height: 320,
	},

	text: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.8)',
		backgroundColor: 'transparent',
		textAlign: 'center',
		paddingHorizontal: 16,
		fontFamily: 'Raleway-Regular',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10 
	},

	title: {
		fontSize: 24,
		color: white,
		backgroundColor: 'transparent',
		textAlign: 'center',
		marginBottom: 16,
		fontFamily: 'Raleway-Bold',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10 
	},

	buttonCircle: {
		width: 40,
		height: 40,
		backgroundColor: 'rgba(0, 0, 0, .2)',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},

	icon: {
		backgroundColor: 'transparent', 
		textShadowColor: 'rgba(0, 0, 0, 0.20)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20 
	},

	ionicons: { 
		backgroundColor: 'transparent'
	},
	
	container: {
		flex: 1
	}
});

export const tutorialStatusStyles = StyleSheet.create({

	section: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: HEIGHT / 4,
	},

	emptySection: {
		opacity: 0 //In order to center the bottom section
	},

	sectionIconRow: {
		flexDirection: 'row',
		marginLeft: 10
	},

	sectionIcon: {
		width: 20,
	},

	skipButtonText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15
	}
});

export const cameraRollImageStyles = StyleSheet.create({
	image: {
		width: Dimensions.get('window').width/3 - 14,
		height: Dimensions.get('window').width/3 - 14,
		borderRadius: 5,
		backgroundColor: black,
	},

	touch: {
		margin: 5,
		borderRadius: 5,
		...Platform.select({
			ios: {
				shadowColor: black,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 2,    
			},
			android: {
				elevation: 5,
			},
		}),
	},

	circleIcon: {
		position: 'absolute', 
		bottom: -15, 
		right: -15, 
		padding: 5,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20
	},

	checkIcon: {
		position: 'absolute', 
		bottom: -10, 
		right: -10, 
		padding: 5,
	},

	shadow : {
		backgroundColor:'#232323',
		position:'absolute', 
		opacity: 0.4
	}
});

export const scheduleCreateStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	surface: {
		padding: 8,
		height: 110,
		width: Dimensions.get('window').width * 0.8,
		borderRadius: 4,
		justifyContent: 'center',
		elevation: 3,
	},

	title: {
		fontSize: 20,
		fontFamily: 'Raleway-Regular',
		textAlign: 'center'
	},

	subtitle: {
		fontFamily: 'Raleway-Regular',
		textAlign: 'center',
		paddingTop: 5,
		paddingBottom: 10
	},

	progressBar: {
		alignSelf:'center'
	}
});

export const selectPictureStyles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%', //Fixes pattern bug
	},

	imageGrid: {
		padding: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		paddingBottom: 88 + 5
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},

	content: {
		flex: 1,
	},

	scroll: {
		paddingTop: 88,
	},

	emptyText: {
		color: white, 
		padding: 20, 
		fontFamily: 'Raleway-Regular', 
		fontSize: 17, 
		textAlign: 'center'
	},
	
	emptyView: {
		alignItems: 'center', 
		padding: 20, 
		height: Dimensions.get('window').height*0.85, 
		justifyContent: 'center'
	}
});

export const takePictureStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: black
	},

	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},

	capture: {
		flex: 0,
		padding: 15,
		borderRadius: 50,
		margin: 20,
		alignSelf: 'center',
		...Platform.select({
			ios: {
				shadowColor: black,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 2,    
			},
			android: {
				elevation: 5,
			},
		}),
	},

	icon: {
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10
	}, 
	
	buttonContainer: { 
		justifyContent: 'center', 
		alignItems: 'center',
		position: 'absolute',
		right: 0,
		left: 0,
		bottom: 0 
	}
});

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' /*Fixes pattern bug*/
	},

	content: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingLeft: 25,
		paddingRight: 25
	},

	logo: {
		height: 100,
		width: undefined
	},

	text: {
		paddingTop: 10,
		fontFamily: 'Raleway-Regular',
		color: white,
		fontSize: 20,
		textAlign: 'center',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20
	},

	userIcon: {
		height: '35%'
	},

	signInButton: {
		width: 312,
		height: 48
	}
});

export const schoolScheduleStyles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' /** Fixes pattern bug*/
	},

	content: {
		flex: 1,
		justifyContent: 'space-evenly'
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	text: {
		width: 220,
		paddingLeft: 15,
		fontFamily: 'Raleway-Regular',
		color: white,
		fontSize: 20
	},

	button: {
		alignItems: 'center',
		marginTop: -100
	},

	buttonSelect: {
		borderRadius: 12,
		backgroundColor: white,
		padding: 17,
		paddingVertical: 21.15,
		alignItems: 'center',
		width: 300,
		elevation: 4
	},

	buttonSelectText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: blue,
		
	},

	buttonTake: {
		borderRadius: 12,
		backgroundColor: 'transparent',
		borderWidth: 3,
		borderColor: white,
		padding: 17,
		alignItems: 'center',
		marginTop: 20,
		width: 300,
		elevation: 4
	},

	buttonTakeText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: white,
		fontWeight:'500',
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20
	},

	manual: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20
	},

	textManual: {
		fontFamily: 'Raleway-Regular',
		color: white,
		fontSize: 15,
	},

	buttonManual: {
		fontFamily: 'Raleway-SemiBold',
		color: white,
		fontSize: 15,
	}
});

export const courseStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flex:1,
		justifyContent:'space-evenly',
		marginTop: StatusBar.currentHeight + Header.HEIGHT,
		paddingHorizontal: 20
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	text: {
		width: 210,
		paddingRight: 15,
		fontFamily: 'Raleway-Regular',
		color: grayColor,
		fontSize: 20,
		textAlign: 'right'
	},

	errorCourseCode: {
		color: 'red',
		fontSize: 12,
		marginLeft: 45
	},

	errorEndTime: {
		color: 'red',
		fontSize: 12
	},

	textInput: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginRight: 5,
		height: 40
	},

	textInputText: {
		fontFamily: 'OpenSans-Regular',
		fontSize: 15,
		color: grayColor,
		paddingBottom: 0
	},

	textInputBorder: {
		borderBottomColor: '#D4D4D4',
		borderBottomWidth: 1,
		width: '87%',
		marginLeft: 10,
	},

	dayOfWeekBorder: {
		borderBottomColor: 'lightgray',
		borderBottomWidth: 1,
		width: '60%',
		marginLeft: 10,
	},

	dayOfWeekTitle: {
		color: blueColor,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		marginRight: 5
	},

	blueTitle: {
		color: blueColor,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 93
	},

	dayOfWeekValues:{
		color: grayColor,
		height: 40,
		width: '105%',
		marginLeft: -5,
		marginBottom:-8
	},

	time: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	},

	buttonEvent: {
		borderRadius: 12,
		backgroundColor: blueColor,
		width: 150,
		height: 57.9,
		elevation: 4,
		marginRight: 25,
		justifyContent:'center'
	},

	buttonEventText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		textAlign: 'center',
		padding: 8
	},

	buttonNext: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		width: 100,
		height: 58,
		borderWidth: 3,
		borderColor: blueColor,
		elevation: 4,
		justifyContent:'center'
	},

	buttonNextText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: blueColor,
		textAlign: 'center',
		padding: 8
	}
});

export const fixedEventStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
		marginTop: StatusBar.currentHeight + Header.HEIGHT
	},

	content: {
		flex: 1,
		justifyContent: 'space-evenly',
		paddingHorizontal: 20
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	errorTitle: {
		color: 'red',
		fontSize: 12,
		marginLeft: 45
	},

	errorEnd: {
		color: 'red',
		fontSize: 12,
		alignSelf: 'flex-start',
		marginLeft: 10
	},

	text: {
		width: 220,
		paddingRight: 15,
		fontFamily: 'Raleway-Regular',
		color: gray,
		fontSize: 20,
		textAlign: 'right'
	},

	textInput: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginRight: 5,
		height: 40
	},
	
	textInputText: {
		fontFamily: 'OpenSans-Regular',
		fontSize: 15,
		color: gray,
		paddingBottom: 0
	},

	textInputBorder: {
		borderBottomColor: '#D4D4D4',
		borderBottomWidth: 1,
		width: '87%',
		marginLeft: 10,
	},

	blueTitle: {
		width: 70,
		color: blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 18
	},

	switch: {
		width: 130,
		alignItems: 'flex-start'
	},

	empty: {
		width:65.8,
		opacity:0
	},
	
	timeSection: {
		alignItems: 'center',
		marginBottom: -20
	},

	allDay: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 5
	},

	rowTimeSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 5
	},

	recurrence:{
		height: 40,
		width: '105%',
		marginLeft: -5,
		marginBottom: -8,
		color: gray
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	},

	buttonEvent: {
		justifyContent:'center',
		marginRight: 25,
		width: 150,
		height: 57.9,
		borderRadius: 12,
		backgroundColor: blue,
		elevation: 4
	},

	buttonEventText: {
		padding: 8,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		textAlign: 'center'
	},

	buttonNext: {
		justifyContent:'center',
		width: 100,
		height: 58,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 3,
		borderColor: blue,
		elevation: 4
	},

	buttonNextText: {
		padding: 8,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: blue,
		textAlign: 'center'
	}
});

export const nonFixedEventStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
		marginTop: StatusBar.currentHeight + Header.HEIGHT
	},

	content: {
		flex: 1,
		justifyContent:'space-evenly',
		paddingHorizontal: 20
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'		
	},

	instructionText: {
		width: 205,
		marginLeft: 15,
		fontFamily: 'Raleway-Regular',
		color: gray,
		fontSize: 20
	},

	errorTitle: {
		color: 'red',
		fontSize: 12,
		marginLeft: 40
	},

	errorEndDate: {
		color: 'red',
		fontSize: 12,
		alignSelf: 'flex-start'
	},
	
	errorDuration: {
		color: 'red',
		fontSize: 12
	},
	textInput: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		marginRight: 5,
		height: 40
	},

	textInputText: {
		fontFamily: 'OpenSans-Regular',
		fontSize: 15,
		color: gray,
		paddingBottom: 0
	},

	textInputBorder: {
		borderBottomColor: 'lightgray',
		borderBottomWidth: 1,
		width: '87%',
		marginLeft: 10,
	},

	sectionTitle: {
		fontFamily: 'Raleway-Medium',
		fontSize: 19,
		color: '#0A2239',
		marginBottom: 5,
		marginTop: 20
	},

	blueTitle: {
		color: blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 88
	},

	blueTitleLong: {
		color: blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 200
	},

	timeSection: {
		marginLeft: 10
	},

	dateRange: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5
	},

	questionLayout: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	duration: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5
	},

	timePicker: {
		flexDirection: 'column',
		alignItems: 'center'
	},

	switch:{
		flexDirection:'row',
		alignItems:'center'
	},

	optionsText: {
		color: gray,
		fontFamily: 'OpenSans-Regular',
		marginBottom: 5
	},

	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 35
	},

	buttonEvent: {
		borderRadius: 12,
		backgroundColor: blue,
		width: 150,
		height: 57.9,
		elevation: 4,
		marginRight: 25,
		justifyContent:'center'
	},

	buttonEventText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		textAlign: 'center',
		padding: 8
	},

	buttonNext: {
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		width: 100,
		height: 58,
		borderWidth: 3,
		borderColor: blue,
		elevation: 4,
		justifyContent:'center'
	},

	buttonNextText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: blue,
		textAlign: 'center',
		padding: 8
	}
});

export const reviewEventStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
		marginTop: StatusBar.currentHeight + Header.HEIGHT
	},

	content: {
		flex:1,
		justifyContent:'space-evenly',
		paddingHorizontal: 20
	},

	sectionTitle: {
		color: gray,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 20,
		marginTop: 20,
		marginBottom: 5
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		zIndex: 1 //To make it go on top of the tutorialStatus
	},
});

export const eventOverviewStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: 70,
		marginVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		elevation: 4
	},

	info: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},

	category: {
		width: 20,
		height: 70,
		marginLeft: -10,
		marginRight: 10,
		borderBottomLeftRadius: 8, 
		borderTopLeftRadius: 8
	},

	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 70
	},

	eventTitle: {
		width: 180,
		fontFamily: 'OpenSans-SemiBold',
		fontSize: 15,
		color: gray
	},

	eventInfo: {
		fontFamily: 'OpenSans-Regular',
		color: gray
	},

	modalView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080',
	},

	modalContent: {
		justifyContent: 'space-between',
		backgroundColor: white,
		borderRadius: 8,
		marginHorizontal: 20
	},

	closeModal: {
		flexDirection:'row',
		justifyContent:'flex-end',
		paddingHorizontal: 15,
		paddingVertical: 10
	},

	modalInfoDate: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		width: 160
	},

	modalInfoTime: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap'
	},

	modalDetailView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center'
	},

	modalTitle: {
		backgroundColor: orange,
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexWrap: 'wrap',
		fontSize: 18,
		fontFamily: 'OpenSans-SemiBold',
		color: '#ffffff'
	},

	modalInfoView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 20
	},

	modalInfoTitle: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 16,
		paddingVertical: 3,
		color: gray
	},

	modalInfoText: {
		fontSize: 15,
		fontFamily: 'OpenSans-Regular',
		paddingVertical: 3,
		color: gray
	},

	modalDetailsView: {
		paddingHorizontal: 20
	},

	modalDetailsTitle: {
		fontSize: 16,
		textDecorationLine: 'underline',
		fontFamily: 'Raleway-SemiBold',
		paddingVertical: 1,
		color: gray
	},
	
	modalDetailsSubtitle: {
		fontSize: 15,
		fontFamily: 'Raleway-SemiBold',
		paddingVertical: 1,
		color: gray
	},

	modalDetailsText: {
		fontSize: 15,
		fontFamily: 'OpenSans-Regular',
		paddingVertical: 1,
		color: gray
	},

	actionsModal: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 10,
		backgroundColor: white,
	},

	actionIconModal: {
		paddingHorizontal: 20
	},

	deleteDialogContent: {
		backgroundColor: white,
		borderRadius: 8,
		justifyContent: 'space-between',
		padding: 10
	},

	deleteDialogMainRow: {
		flexDirection: 'row'
	},

	deleteDialogRightCol: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingRight: 10
	},

	deleteDialogQuestion: {
		fontSize: 20,
		fontFamily: 'Raleway-SemiBold',
		marginLeft: 10,
		color: gray
	},

	deleteDialogOptions: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},

	deleteDialogCancel: {
		fontFamily: 'Raleway-SemiBold',
		fontSize:16,
		color: gray
	},

	deleteDialogYes: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 16,
		color: '#ff0000',
		marginLeft: 20
	}
});

export const dashboardStyles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%'
	},

	fab: {
		position: 'absolute',
		right: 0
	}
});

export const chatbotStyles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%'
	}
});

export const compareScheduleStyles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%'
	}
});

export const settingsStyles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%'
	}
});