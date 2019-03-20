import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { chatbotStyles as styles } from '../../styles';
import updateNavigation from '../NavigationHelper';

/**
 * Permits the user to input or modifiy events in their calendar by talking to a chatbot
 */
class Chatbot extends React.PureComponent {
	constructor(props) {
		super(props);

		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#2d6986'} />
			</View>
		);
	}
}

export default Chatbot;