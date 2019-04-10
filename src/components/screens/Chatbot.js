import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { chatbotStyles as styles, statusBarDark } from '../../styles';
import updateNavigation from '../NavigationHelper';

/**
 * Permits the user to input or modifiy events in their calendar by talking to a chatbot
 */
class Chatbot extends React.PureComponent {

	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props);

		updateNavigation('Chatbot', props.navigation.state.routeName);
	}

	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBarDark} />
			</View>
		);
	}
}

export default Chatbot;