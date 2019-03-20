import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { bottomButtonsStyles as styles } from '../styles';

/**
 * 
 * @prop {Boolean} twoButtons The number of buttons
 * @prop {Array} buttonText An array of the title of the buttons
 * @prop {Array} buttonMethods An array of the methods of the buttons
 */
class BottomButtons extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			twoButtons: true, 
			buttonText: ['Add', 'Next'],
			...props
		};
	}

	render() {
		const { twoButtons, buttonText, buttonMethods } = this.state;
		return (
			<View style={styles.buttons}>
				<TouchableOpacity style={[styles.button, { width: twoButtons ? '48%': '100%'}]}
					onPress={buttonMethods[0]}>
					<Text style={styles.buttonText}>
						{buttonText[0]}
					</Text>
				</TouchableOpacity>
				{ 
					twoButtons ? 
						<TouchableOpacity style={[styles.button, styles.buttonNext]}
							onPress={buttonMethods[1]}>
							<Text style={styles.buttonText}>
								{buttonText[1]}
							</Text>
						</TouchableOpacity> : null
				}
			</View>
		);
	}
}

export default BottomButtons;