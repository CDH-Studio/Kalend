import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { tutorialStatusStyles as styles } from '../styles';

const dotSize = 20;
const sectionMargin = 20;
export const HEIGHT = dotSize + sectionMargin * 2;

/**
 * 
 */
class TutorialStatus extends React.Component {

	constructor(props) {
		super(props);

		let colors = [];
		for (let i = 0; i < 4; i++) {
			if (i + 1 === this.props.active) {
				colors[i] = this.props.color;
			} else {
				colors[i] = this.props.color + '9C';
			}
		}

		let skip;
		if(this.props.skip === undefined) {
			skip = <Text style={[styles.skipButtonText, {opacity: 0}]}>Skip</Text>;
		} else {
			skip = <Text style={[styles.skipButtonText, {color: this.props.color}]}>Skip</Text>;
		}

		this.state = {
			colors,
			skip
		};
	}

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

		return(
			<View style={[styles.section, {backgroundColor: this.props.backgroundColor}]}>
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