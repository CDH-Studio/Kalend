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
		const { colors} = this.state;
		return(
			<View style={styles.section}>
				<View style={styles.emptySection}>
					<Text style={styles.skipButtonText}>Skip</Text>
				</View>
				<View style={styles.sectionIconRow}>
					<Octicons name="primitive-dot" size={20} color={colors[0]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={20} color={colors[1]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={20} color={colors[2]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={20} color={colors[3]} style={styles.sectionIcon} />
					<Octicons name="primitive-dot" size={20} color={colors[4]} style={styles.sectionIcon} />
				</View>
				
				<View style={styles.skipButton}>
					<TouchableOpacity onPress={this.props.skip}>
						<Text style={styles.skipButtonText}>Skip</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

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
		margin: 20,
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
		color: 'white',
		fontFamily: 'Raleway-Regular',
		fontSize: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10
	}
});