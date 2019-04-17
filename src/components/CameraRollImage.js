import React from 'react';
import { Image, TouchableOpacity, View, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { cameraRollImageStyles as styles, blue, white } from '../styles';

const selectedIconSize = 35;

/**
 * The image component that populates the camera roll screen
 * 
 * @prop {String} image The URI of the image
 * @prop {Integer} index The index of the picture in the camera roll
 * @prop {Integer} selectedStyle A number either 1 or 0, defining if it is selected
 */
class CameraRollImage extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			scale: new Animated.Value(0)
		};
	}

	componentWillReceiveProps(newProp) {
		if (this.props.selectedStyle !== newProp.selectedStyle) {
			Animated.timing(
				this.state.scale,
				{
					toValue: newProp.selectedStyle,
					useNativeDriver: true,
					duration: 100
				},
			).start();
		}
	}

	/**
	 * Calls the parent function onUpdate to update which image was selected
	 */
	update = (selected, index) => {
		this.props.onUpdate({selected, index});
	}

	render () {
		const { image, index, selectedStyle } = this.props;

		return (
			<View>
				<View style={[styles.image, styles.shadow, {
					margin: 5,
					borderRadius: 5,}]}/>

				<TouchableOpacity
					onPress={() => this.update(image.uri, index)}
					activeOpacity={0.7}>
					<Animated.View style={[styles.touch, {transform: [
						{scaleX: this.state.scale.interpolate({
							inputRange: [0, 1],
							outputRange: [1, 0.8]
						})}, 
						{scaleY: this.state.scale.interpolate({
							inputRange: [0, 1],
							outputRange: [1, 0.8]
						})}, 
						{perspective: 1000}]}]} >
						<Image style={styles.image} 
							source={{ uri: image.uri }} >
						</Image>

						<Icon style={[styles.circleIcon, {opacity: selectedStyle}]} 
							name="checkbox-blank-circle" 
							size={selectedIconSize} 
							color={blue} />

						<Icon style={[styles.checkIcon, {opacity: selectedStyle}]} 
							name="check" 
							size={selectedIconSize - 10}
							color={white} />
					</Animated.View>
				</TouchableOpacity>
			</View>
		);
	}
}

export default CameraRollImage;