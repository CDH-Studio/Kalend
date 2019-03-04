import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient  from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import updateNavigation from '../NavigationHelper';
import { slides, statusBarDark } from '../../../config';

const slidesIconSize = 200;
const nextIconSize = 24;
const nextIconColor = 'rgba(255, 255, 255, .9)';

/**
 * The slides for the first four screens when a user first opens the application.
 * This screen only shows if the user has not already been in the application.
 */
class WelcomeScreen extends React.Component {
	
	constructor(props) {
		super(props);

		// Updates the navigation location in redux
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	/**
	 * Renders each slide
	 */
	renderSlide = props => (
		<LinearGradient
			style={[styles.mainContent, {
				paddingTop: props.topSpacer,
				paddingBottom: props.bottomSpacer }]}
			colors={props.colors}
			start={{x: 0, y: .1}} 
			end={{x: .1, y: 1}}>

			{ 
				props.icon === '' ? 
					null : 
					<Ionicons style={styles.icon} 
						name={props.icon} 
						size={slidesIconSize} 
						color={props.color} /> 
			}
			
			<View>
				<Text style={styles.title}>{props.title}</Text>
				<Text style={styles.text}>{props.text}</Text>
			</View>
		</LinearGradient>
	);

	/**
	 * Returns the next button
	 */
	renderNextButton = () => {
		return (
			<View style={styles.buttonCircle}>
				<Ionicons
					name="md-arrow-round-forward"
					color={nextIconColor}
					size={nextIconSize}
					style={styles.ionicons} />
			</View>
		);
	}

	/**
	 * Returns the done button
	 */
	renderDoneButton = () => {
		return (
			<View style={styles.buttonCircle}>
				<Ionicons
					name="md-checkmark"
					color={nextIconColor}
					size={nextIconSize}
					style={styles.ionicons} />
			</View>
		);
	}

	/**
	 * Navigates to the next screen (Login screen)
	 */
	next = () => {
		this.props.navigation.navigate('LoginNavigator');
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar translucent={true} 
					backgroundColor={statusBarDark} />

				<AppIntroSlider slides={slides} 
					renderItem={this.renderSlide} 
					onDone={this.next}
					renderDoneButton={this.renderDoneButton}
					renderNextButton={this.renderNextButton}/>
			</View>
		);
	}
}

export default WelcomeScreen;

const styles = StyleSheet.create({
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
	},
	ionicons: { 
		backgroundColor: 'transparent'
	},
	container: {
		flex: 1
	}
});