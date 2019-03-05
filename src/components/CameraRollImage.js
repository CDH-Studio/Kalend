import React from 'react';
import { Image, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { orangeColor, imageRollCheck } from '../../config';

const selectedIconSize = 35;

/**
 * The image component that populates the camera roll screen
 */
class CameraRollImage extends React.Component {

	/**
	 * Calls the parent function onUpdate to update which image was selected
	 * 
	 * @param {String} selected The image URI that has been selected
	 * @param {Integer} index The id of the image that has been selected
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
						color={orangeColor} />

					<Icon style={[styles.checkIcon, {opacity: selectedStyle}]} 
						name="check" 
						size={selectedIconSize} 
						color={imageRollCheck} />
				</TouchableOpacity>
			</View>
		);
	}
}

export default CameraRollImage;

const styles = StyleSheet.create({
	image: {
		width: Dimensions.get('window').width/3 - 14,
		height: Dimensions.get('window').width/3 - 14,
		borderRadius: 5,
		backgroundColor: 'black',
	},

	touch: {
		margin: 5,
		borderRadius: 5,
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 2,    
			},
			android: {
				elevation: 5,
			},
		}),
	},

	circleIcon: {
		position: 'absolute', 
		bottom: -15, 
		right: -15, 
		padding: 5,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 20
	},

	checkIcon: {
		position: 'absolute', 
		bottom: -10, 
		right: -10, 
		padding: 5,
	},
	
	shadow : {
		backgroundColor:'#232323',
		position:'absolute', 
		opacity: 0.4
	}
});