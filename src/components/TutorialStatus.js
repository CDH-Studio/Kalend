import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { tutorialStatusStyles as styles } from '../styles';

const dotSize = 20;
const sectionMargin = 20;
export const HEIGHT = dotSize + sectionMargin * 2;

/**
 * The bottom dots in the tutorial screens indicating where 
 * the user is in the tutorial setup procedure
 * 
 * @param {Integer} active The index of the active dot
 * @param {String} color The color of the TutorialStatus
 * @param {Function} skip The method that will be executed when skip is pressed
 */
class TutorialStatus extends React.Component {

	constructor(props) {
		super(props);

		// According to active index, darken that dot
		let colors = [];
		for (let i = 0; i < 4; i++) {
			if (i + 1 === props.active) {
				colors[i] = props.color;
			} else {
				colors[i] = props.color + '9C';
			}
		}

		// If no skip function has been passed, do not show the skip button/text
		let skip;
		if (props.skip === undefined) {
			skip = <Text style={[styles.skipButtonText, {opacity: 0}]}>Skip</Text>;
		} else {
			skip = <Text style={[styles.skipButtonText, {color: props.color}]}>Skip</Text>;
		}

		this.state = {
			colors,
			skip
		};
	}

	/**
	 * Creates the dots at the bottom
	 */
	createDots = () => {
		let dots = [];
		const { colors } = this.state;

		for (let i = 0; i < 4; i++) {
			dots.push(
				<Octicons name="primitive-dot" 
					key={i}
					size={dotSize} 
					color={colors[i]} 
					style={styles.sectionIcon} />);
		}

		return dots;
	}

	render() {
		const { skip } = this.state;
		const { backgroundColor } = this.props;

		return(
			<View style={[styles.section, {backgroundColor: backgroundColor}]}>
				<View style={styles.emptySection}>
					<Text style={styles.skipButtonText}>Skip</Text>
				</View>
				<View style={styles.sectionIconRow}>
					{this.createDots()}
				</View>
				
				<View style={styles.skipButton}>
					<TouchableOpacity onPress={this.props.skip}>
						{skip}
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export default TutorialStatus;