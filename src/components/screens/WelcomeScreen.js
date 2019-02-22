import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { gradientColors, orangeColor } from '../../../config';
import LinearGradient  from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
	mainContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
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
		color: 'white',
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
	}
});

const slides = [
	{
		key: 'integration',
		title: 'School Schedule Integration',
		text: 'Add your school schedule by importing\na picture or a screenshot of your schedule',
		icon: 'ios-school',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'generator',
		title: 'Schedule Generator',
		text: 'Add your events and the activities you\nwould like to do and let the application\ngenerate the best schedules for you',
		icon: 'ios-calendar',
		colors: [orangeColor,'#FF621C'],
		color: '#FFE0B6'
	},
	{
		key: 'compare',
		title: 'Compare Schedule',
		text: 'Find availabilities by comparing schedules\nwith your friends and colleagues',
		icon: 'ios-people',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'done',
		title: 'Start right now\nwith Kalend!',
		text: '',
		icon: '',
		colors: [orangeColor,'#FF621C'],
	}
];

class WelcomeScreen extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			showRealApp: false
		};
	}

	_renderItem = props => (
		<LinearGradient
			style={[styles.mainContent, {
				paddingTop: props.topSpacer,
				paddingBottom: props.bottomSpacer,
				width: props.width,
				height: Dimensions.get('window').height + StatusBar.currentHeight,
			}]}
			colors={props.colors}
			start={{x: 0, y: .1}} end={{x: .1, y: 1}} >
			{props.icon === '' ? null : <Ionicons style={styles.icon} name={props.icon} size={200} color={props.color} /> }
			
			<View>
				<Text style={styles.title}>{props.title}</Text>
				<Text style={styles.text}>{props.text}</Text>
			</View>
		</LinearGradient>
	);

	_renderNextButton = () => {
		return (
			<View style={styles.buttonCircle}>
				<Ionicons
					name="md-arrow-round-forward"
					color="rgba(255, 255, 255, .9)"
					size={24}
					style={{ backgroundColor: 'transparent' }} />
			</View>
		);
	}

	_renderDoneButton = () => {
		return (
			<View style={styles.buttonCircle}>
				<Ionicons
					name="md-checkmark"
					color="rgba(255, 255, 255, .9)"
					size={24}
					style={{ backgroundColor: 'transparent' }} />
			</View>
		);
	}

	_onDone = () => {
		// User finished the introduction. Show real app through
		// navigation or simply by controlling state
		this.setState({ showRealApp: true });
		this.props.navigation.navigate('LoginNavigator');
	}

	render() {
		return (
			<View style={{flex:1}}>
				<StatusBar translucent={true} backgroundColor={'#00000050'} />
				<AppIntroSlider slides={slides} 
					renderItem={this._renderItem} 
					onDone={this._onDone}
					renderDoneButton={this._renderDoneButton}
					renderNextButton={this._renderNextButton}/>
			</View>
		);
	}
}

export default WelcomeScreen;