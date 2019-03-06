import React from 'react';
import { Text, View, Platform, Animated } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { tutorialStatusStyles as styles } from '../styles';
import { FAB } from 'react-native-paper';
import { darkBlueColor } from '../../config';

const dotSize = 20;
const sectionMargin = 20;
export const HEIGHT = dotSize + sectionMargin * 2;

/**
 * The bottom dots in the tutorial screens indicating where 
 * the user is in the tutorial setup procedure
 * 
 * @param {Integer} active The index of the active dot
 * @param {String} color The color of the TutorialStatus
 * @param {Function} next The method that will be executed when next is pressed
 * @param {Boolean} showTutShadow Shows the shadow of the tutorial status if true, there's none otherwise
 * @param {String} backgroundColor The background color of the tutorial status
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

		// If no next function has been passed, do not show the next button/text
		let next;
		if (props.skip === undefined) {
			next =  <FAB style={[styles.fab, {opacity: 0}]}
				small
				icon="arrow-forward" />;
		} else {
			if (props.color === '#ffffff') {
				next = <FAB style={[styles.fab, {backgroundColor: props.color}]}
					small
					color={darkBlueColor}
					icon="arrow-forward"
					onPress={props.skip} />;
			} else {
				next = <FAB style={[styles.fab, {backgroundColor: props.color}]}
					small
					icon="arrow-forward"
					onPress={props.skip} />;
			}
		}

		this.state = {
			colors,
			next,
			shadowOpacity: new Animated.Value(0)
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

	// componentWillReceiveProps(newProps) {
	// 	if (newProps.showTutShadow) {
	// 		if (this.state.shadowOpacity._value != 1) {
	// 			Animated.timing(
	// 				this.state.shadowOpacity,
	// 				{ 
	// 					toValue: 1,
	// 					useNativeDriver: true,
	// 				},
	// 			).start(); 
	// 		}
	// 	} else {
	// 		if (this.state.shadowOpacity._value != 0) {
	// 			Animated.timing(
	// 				this.state.shadowOpacity,
	// 				{ 
	// 					toValue: 0,
	// 					useNativeDriver: true,
	// 				},
	// 			).start(); 
	// 		}
	// 	}
	// 	console.log(newProps.showTutShadow);
	// }

	render() {
		const { next } = this.state;
		const { backgroundColor } = this.props;	

		return(
			<View style={[styles.section, {
				backgroundColor: backgroundColor, 
				paddingBottom: ifIphoneX() ? 20 : 20,
				...Platform.select({
					ios: {
						shadowColor: 'black',
						shadowOffset: { width: 0, height: -2 },
						shadowOpacity: this.state.shadowOpacity._value * 0.3,
						shadowRadius: 3,    
					},
					android: {
						elevation: this.state.shadowOpacity._value *  3,
					},
				}),}]}>
				<View style={{flex:1, 
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',}}>
					<View style={styles.sectionIconRow}>
						{this.createDots()}
					</View>
				</View>
				
				{ next }
			</View>
		);
	}
}

export default TutorialStatus;