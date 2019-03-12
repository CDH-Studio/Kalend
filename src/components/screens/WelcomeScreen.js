import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient  from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import updateNavigation from '../NavigationHelper';
import { slides, statusBarDark } from '../../../config';
import { welcomeStyles as styles } from '../../styles';

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