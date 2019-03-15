import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Header } from 'react-navigation';
import { HEIGHT } from './components/TutorialStatus';
import { getStatusBarHeight, ifIphoneX} from 'react-native-iphone-x-helper';

export const white = '#FFFFFF';
export const black = '#000';
export const blue = '#1D84B5'; //#1473E6 
export const statusBlueColor = '#0A2239'; //#105DBA
export const dark_blue = '#153d73'; //#0E4BAA
export const red = '#B80000';
export const statusBarDark = '#00000050';
export const gray = '#565454';

export const snackbarStyle = StyleSheet.create({
	snackbar: {
		bottom: Dimensions.get('screen').height - getStatusBarHeight() - Header.HEIGHT - 90, 
		marginHorizontal: '5%'
	}
});

export const bottomButtonsStyles = StyleSheet.create({
	buttons: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20
	},

	button: {
		backgroundColor: blue,
		color:'white',
		width: '48%',
		padding: 5,
		borderRadius: 5,
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
		}),
	},

	buttonNext: {
		marginLeft: '4%',
		backgroundColor: dark_blue
	},	

	buttonText: {
		padding: 8,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15,
		color: '#FFFFFF',
		textAlign: 'center'
	},
});

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
		height: Dimensions.get('window').height + getStatusBarHeight(),
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
		paddingVertical: HEIGHT / 2 + 6,
		paddingBottom: ifIphoneX() ? 30 : 20,
	},

	sectionDots: {
		position: 'absolute',
		width: '100%',
		paddingTop: 20,
		alignItems: 'center',
	},

	sectionIconRow: {
		flexDirection: 'row',
		marginLeft: 10,
	},

	sectionIcon: {
		width: 20,
	},

	fab: {
		position: 'absolute',
		margin: 16,
		marginBottom: ifIphoneX() ? 17 : 7,
		right: 0,
		bottom: 0,
	},

	skipButtonText: {
		fontFamily: 'Raleway-SemiBold',
		paddingHorizontal: 20,
		marginBottom: 10,
		fontSize: 15,
		color: 'white',
	},

	skipButton: {
		position: 'absolute',
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
	},
});

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' /*Fixes pattern bug*/
	},

	content: {
		flex: 1,
		alignItems: 'center'
	},

	logo: {
		height: '30%'
	},

	topSection: {
		flexGrow: 3,
		justifyContent: 'center',
		marginTop: getStatusBarHeight(),
		paddingLeft: 25,
		paddingRight: 25
	},

	bottomSection: {
		flexGrow: 1,
		alignItems: 'center',
		backgroundColor: '#0000003C',
		width: '100%'
	},

	signInSection: {
		flexGrow: 2,
		justifyContent: 'center'
	},

	signInButton: {
		width: 312,
		height: 48
	},

	cdhSection: {
		flexGrow: 1,
		width: '100%',
		paddingVertical: 5,
		backgroundColor: '#00000060',
		justifyContent: 'center'
	},

	cdhSectionText: {
		color: white,
		textAlign: 'center'
	},

	cdhText: {
		fontFamily: 'Raleway-Regular'
	},

	cdhLink: {
		fontFamily: 'Raleway-SemiBold'
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

	shadowIcon : {
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20
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
		fontSize: 20,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 20
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

export const schoolScheduleCreationStyles = StyleSheet.create({
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
		height: 100,
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
	}
});

export const courseStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flex:1,
		justifyContent:'space-evenly',
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
		color: gray,
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
		color: gray,
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
		color: dark_blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		marginRight: 5
	},

	blueTitle: {
		color: dark_blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 93
	},

	dayOfWeekValues:{
		color: gray,
		height: 40,
		width: '105%',
		marginLeft: -5,
		marginBottom:-8
	},

	time: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	...snackbarStyle
});

export const fixedEventStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
	},

	content: {
		flex: 1,
		justifyContent: 'space-evenly',
		paddingHorizontal: 20
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: -200
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
		color: dark_blue,
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

	...snackbarStyle
});

export const nonFixedEventStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
		paddingHorizontal: 15,
		marginBottom: 20,
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
		color: dark_blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		width: 88
	},

	blueTitleLong: {
		color: dark_blue,
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

	...snackbarStyle
});

export const unavailableHoursStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
	},

	content: {
		flex: 1,
		justifyContent: 'space-evenly',
		paddingHorizontal: 20
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 20
	},

	errorEndTime: {
		color: 'red',
		fontSize: 12,
		width: 140,
		textAlign: 'center'
	},

	text: {
		width: 240,
		paddingRight: 15,
		fontFamily: 'Raleway-Regular',
		color: gray,
		fontSize: 20,
		textAlign: 'right'
	},


	blueTitle: {
		color: dark_blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 18,
		paddingVertical: 10,
		paddingLeft: 10
	},

	rowContent: {
		flexDirection:'row',
		justifyContent:'space-evenly'
	},

	colContent: {
		flexDirection:'column',
		alignItems: 'center'
	},

	row: {
		flexDirection:'row',
		alignItems: 'center'
	},

	type: {
		fontSize: 15,
		fontFamily: 'Raleway-SemiBold'
	},

	timeWidth: {
		width: 70
	},

	manual: {
		flexDirection: 'row',
		justifyContent: 'center',
		textAlign:'center',
		paddingTop: 20
	},

	textManual: {
		fontFamily: 'Raleway-Regular',
		color: gray,
		fontSize: 15,
	},

	buttonManual: {
		fontFamily: 'Raleway-SemiBold',
		color: gray,
		fontSize: 15,
	},

	...bottomButtonsStyles
});

export const reviewEventStyles = StyleSheet.create({
	container: {
		flex: 1
	},

	scrollView: {
		flex: 1,
	},

	content: {
		flex:1,
		paddingHorizontal: 20
	},

	sectionTitle: {
		color: dark_blue,
		fontFamily: 'Raleway-SemiBold',
		fontSize: 17,
		marginTop: 20,
		marginBottom: 5
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0
	},

	textNoData: {
		color: gray,
	}
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
		}),
	},

	info: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
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
		position: 'absolute',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
		height: '100%'
	},

	eventTitle: {
		width: 180,
		fontFamily: 'OpenSans-SemiBold',
		fontSize: 15,
		color: gray
	},

	eventInfo: {
		width: 180,
		fontFamily: 'OpenSans-Regular',
		color: gray
	},

	modalView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080',
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.6,
				shadowRadius: 7,    
			},
			android: {
				elevation: 4,
			},
		}),
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
		paddingVertical: 10,
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
		backgroundColor: blue,
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

const DashboardButton = StyleSheet.create({
	button: {
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.4,
				shadowRadius: 2,    
			},
			android: {
				elevation: 4,
			},
		}),
		backgroundColor: blue, 
		padding: 5, 
		borderRadius: 5, 
		marginBottom: 10
	},

	buttonText: {
		fontSize: 16,
		color: white,
		padding: 4
	}
});

export const dashboardStyles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%',
		padding: 10
	},

	fab: {
		position: 'absolute',
		right: 0
	},

	profileImage: {
		width: 100, 
		height: 100, 
		borderRadius: 50, 
		marginVertical: 5
	},

	topProfileContainer: {
		flexDirection: 'row', 
		justifyContent:'center', 
		alignItems:'center', 
		margin: 10
	},

	profileDescription: {
		width: '50%', 
		padding: 10, 
		fontFamily: 'Raleway-Regular', 
		color: gray, 
		fontSize: 16
	},

	...DashboardButton
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
		height: '100%',
		padding: 10
	},

	...DashboardButton
});

export const cleanReducersStyles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%',
		padding: 10
	},

	...DashboardButton
});

export const schoolInformationStyles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 20,
		height: null, 
		alignContent: 'space-between'
	},

	smallText: {
		fontFamily: 'Raleway-Regular'
	},

	instruction: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flex:1,
	},

	text: {
		width: 240,
		paddingRight: 15,
		fontFamily: 'Raleway-Regular',
		color: gray,
		fontSize: 20,
		textAlign: 'right'
	},

	subHeader: {
		fontFamily: 'Raleway-Medium',
		color: dark_blue,
		fontSize: 18,
		marginBottom: 10
	},

	radioButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: -8
	},

	bottomContent: {
		flex:3,
		alignContent: 'space-between'
	},

	school: {
		justifyContent: 'center',
		flex:1,
	},

	duration: {
		flex:1,
		justifyContent: 'center',
	},

	date: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	errorTitle: {
		fontFamily: 'Raleway-Regular',
		color: red,
		marginTop: 10
	},
});