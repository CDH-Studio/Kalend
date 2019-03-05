import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { blueColor } from '../../../config';
import { chatbotStyles as styles } from '../../styles';

/**
 * Permits the user to input or modifiy events in their calendar by talking to a chatbot
 */
class Chatbot extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={blueColor} />

				<Text>Chatbot Screen</Text>

			</View>
		);
	}
}

export default Chatbot;