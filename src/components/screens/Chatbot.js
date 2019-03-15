import React from 'react';
import { StatusBar, View } from 'react-native';
import { chatbotStyles as styles } from '../../styles';

/**
 * Permits the user to input or modifiy events in their calendar by talking to a chatbot
 */
class Chatbot extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={'#2d6986'} />
			</View>
		);
	}
}

export default Chatbot;