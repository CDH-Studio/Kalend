import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
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
				<View style={[styles.image, styles.touch, styles.shadow]}/>

				<TouchableOpacity
					style={[styles.touch, {transform: [{scaleX: 1 - 0.2 * selectedStyle}, {scaleY: 1 - 0.2 * selectedStyle}]}]} 
					onPress={() => this.update(image.uri, index)}
					activeOpacity={0.7}>
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
				</TouchableOpacity>
			</View>
		);
	}
}

export default CameraRollImage;