import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

class TutorialStatus extends React.Component {

	constructor(props) {
		super(props);

		let colors = [];
		for (let i = 0; i < 5; i++) {
			if (i + 1 === this.props.active) {
				colors[i] = this.props.color;
			} else {
				colors[i] = this.props.color + '9C';
			}
		}

		this.state = {
			colors
		};
	}

	render() {
		const {colors} = this.state;
		return(
			<View style={[styles.section, {backgroundColor:this.props.backgroundColor}]}>
				<View style={styles.emptySection}>
					<Text style={styles.skipButtonText}>Skip</Text>
				</View>
				<View style={styles.sectionIconRow}>
					<Octicons name="primitive-dot" size={dotSize} color={colors[0]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={dotSize} color={colors[1]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={dotSize} color={colors[2]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={dotSize} color={colors[3]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={dotSize} color={colors[4]} style={styles.sectionIcon} />
				</View>
				
				<View style={styles.skipButton}>
					<TouchableOpacity onPress={this.props.skip}>
						<Text style={[styles.skipButtonText, {color:this.props.color}]}>Skip</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const dotSize = 20;
const sectionMargin = 20;
export const HEIGHT = dotSize + sectionMargin*2;

export default TutorialStatus;

const styles = StyleSheet.create({

	section: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: HEIGHT/4,
	},

	emptySection: {
		opacity: 0 //In order to center the bottom section
	},

	sectionIconRow: {
		flexDirection: 'row',
		marginLeft: 10
	},

	sectionIcon: {
		width: 20,
	},

	skipButtonText: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 15
	}
});