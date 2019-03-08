import React from 'react';
import { Text, View, Platform, TouchableOpacity, Keyboard } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { tutorialStatusStyles as styles, white } from '../styles';

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
		if (props.skip && props.color === white) {
			next = 
			<View style={{
				flexDirection: 'row',
				justifyContent: 'flex-end',
				alignItems: 'center'}}>
				<TouchableOpacity style={styles.skipButton} 
					onPress={props.skip} >
					<Text style={styles.skipButtonText}>Skip</Text>
				</TouchableOpacity>
			</View>;
		}

		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

		this.state = {
			colors,
			next,
			showTutShadow: props.showTutShadow
		};
	}

	componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}
  
	keyboardDidShow = () => {
		this.setState({
			prevShowTutShadow: this.state.showTutShadow,
			showTutShadow: true
		});
		this.forceUpdate();
	}
  
	keyboardDidHide = () => {
		this.setState({
			prevShowTutShadow: null,
			showTutShadow: this.state.prevShowTutShadow
		});
		this.forceUpdate();
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

	shouldComponentUpdate(newProps) {
		if (newProps.showTutShadow !== this.props.showTutShadow) {
			this.setState({
				showTutShadow: newProps.showTutShadow
			});
			return true;
		}
		return false;
	}

	render() {
		const { next, showTutShadow } = this.state;
		const { backgroundColor } = this.props;	

		return(
			<View style={[styles.section, {
				backgroundColor: backgroundColor, 
				paddingBottom: ifIphoneX() ? 30 : 20,
				...Platform.select({
					ios: {
						shadowColor: 'black',
						shadowOffset: { width: 0, height: -2 },
						shadowOpacity: showTutShadow * 0.3,
						shadowRadius: 3,    
					},
					android: {
						elevation: showTutShadow *  10,
					},
				}),}]}>
				<View style={{ 
					position: 'absolute',
					width: '100%',
					paddingTop: 20,
					alignItems: 'center',}}>
					<View style={styles.sectionIconRow}>
						{this.createDots()}
					</View>
				</View>
				{next}
			</View>
		);
	}
}

export const onScroll = (event, value) => {
	event = event.nativeEvent;
	if (parseInt(event.contentOffset.y + event.layoutMeasurement.height) >= parseInt(event.contentSize.height)) {
		return true;
	} else if (!value) {
		return false;
	}
	return false;
};

export default TutorialStatus;