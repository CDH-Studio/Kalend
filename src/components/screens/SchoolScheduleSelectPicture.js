import React, { Component, PropTypes } from 'react';
import {
	CameraRoll,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	PermissionsAndroid,
	StatusBar,
	Platform,
	Dimensions,
	ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradientColors } from '../../../config';


async function requestCameraPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
				title: 'Read Storage Permission',
				message:
				'Kalend needs access to storage in ' +
				'order to show you your camera roll.',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);

		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('You can read the storage');
		} else {
			console.log('Read storage permission denied');
		}
	} catch (err) {
		console.warn(err);
	}
}

class SchoolScheduleSelectPicture extends Component {


	constructor(props) {
		super(props);
		requestCameraPermission();
		this.state = {
			images: [],
			selected: '',
			fetchParams: { 
				first: 100, 
				assetType: 'Photos',
			},
			showFAB: false
		};
		this._storeImages = this._storeImages.bind(this);
		this._logImageError = this._logImageError.bind(this);
		this._selectImage = this._selectImage.bind(this);
	}

	componentDidMount() {
		CameraRoll.getPhotos(this.state.fetchParams, this._storeImages, this._logImageError);
	}

	_storeImages(data) {
		const assets = data.edges;
		const images = assets.map( asset => asset.node.image );
		this.setState({
			images: images,
		});
	}

	_logImageError(err) {
		console.log(err);
	}

	_selectImage(uri) {
		this.setState({
			selected: uri,
			showFAB: true
		});
		console.log('Selected image: ', uri);
	}

	render() {
		return (

			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<View style={{flex: 1}}>
						<StatusBar translucent={true} backgroundColor={'#00000050'} />
						<ScrollView>
							<View style={styles.imageGrid}>
								{ this.state.images.map(image => {
									return (
										<TouchableOpacity key={image.uri} style={styles.touch} onPress={() => this._selectImage(image.uri)}>
											<Image style={styles.image} source={{ uri: image.uri }} />
										</TouchableOpacity>
									);
								})}
							</View>

						</ScrollView>
					</View>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '110%' //Fixes pattern bug
	},
	imageGrid: {
		padding: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	image: {
		width: Dimensions.get('window').width/3 - 14,
		height: Dimensions.get('window').width/3 - 14,
		borderRadius: 5,
	},
	touch: {
		margin: 5,
		borderRadius: 5,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 2,    
			},
			android: {
				elevation: 5,
			},
		}),
	},
	fab: {
	  position: 'absolute',
	  margin: 16,
	  right: 0,
	  bottom: 0,
	},
});

export default SchoolScheduleSelectPicture;