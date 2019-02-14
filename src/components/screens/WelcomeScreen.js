import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { gradientColors } from '../../../config';
import LinearGradient  from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
	
	mainContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		height: '110%'
	  },
	  image: {
		width: 320,
		height: 320,
	  },
	  text: {
		color: 'rgba(255, 255, 255, 0.8)',
		backgroundColor: 'transparent',
		textAlign: 'center',
		paddingHorizontal: 16,
	  },
	  title: {
		fontSize: 22,
		color: 'white',
		backgroundColor: 'transparent',
		textAlign: 'center',
		marginBottom: 16,
	  },
	buttonCircle: {
		width: 40,
		height: 40,
		backgroundColor: 'rgba(0, 0, 0, .2)',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

const slides = [
	{
		key: 'somethun',
		title: 'Title 1',
		text: 'Description.\nSay something cool',
		icon: 'ios-images',
		colors: gradientColors,
	},
	{
		key: 'somethun-dos',
		title: 'Title 2',
		text: 'Other cool stuff',
		icon: 'ios-cloud-upload',
		colors: gradientColors,
	},
	{
		key: 'somethun1',
		title: 'Rocket guy',
		text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
		icon: 'ios-people',
		colors: gradientColors,
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
				height: props.height,
			}]}
			colors={props.colors}
			start={{x: 0, y: .1}} end={{x: .1, y: 1}} >
			<Ionicons style={{ backgroundColor: 'transparent', textShadowColor: 'rgba(0, 0, 0, 0.40)',
							textShadowOffset: {width: -1, height: 1},
							textShadowRadius: 20 }} name={props.icon} size={200} color="white" />
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
	}

	render() {
		if (this.state.showRealApp) {
			this.props.navigation.navigate('LoginNavigator');
		} 
		return <AppIntroSlider slides={slides} 
			renderItem={this._renderItem} 
			onDone={this._onDone}
			renderDoneButton={this._renderDoneButton}
			renderNextButton={this._renderNextButton}/>;
	}
}

export default WelcomeScreen;