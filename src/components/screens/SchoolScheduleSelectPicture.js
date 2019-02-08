import React from 'react';
import { CameraRoll, Image, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar, Platform, Dimensions, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradientColors } from '../../../config';

class SchoolScheduleSelectPicture extends React.Component {
	static navigationOptions = {
		title: 'Add School Schedule',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			images: [],
			selected: '',
			fetchParams: { 
				first: 99, 
				assetType: 'Photos',
			},
			showFAB: false
		};
		this._selectImage = this._selectImage.bind(this);
	}

	componentDidMount() {
		CameraRoll.getPhotos(this.state.fetchParams)
			.then((data) => {
				this.setState({
					images: data.edges.map((edge) => edge.node.image),
				});
			})
			.catch((error) => console.log(error));
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
			<LinearGradient style={styles.container} 
				colors={gradientColors}>
				<ImageBackground style={styles.container} 
					source={require('../../assets/img/loginScreen/backPattern.png')} 
					resizeMode="repeat">
					<View style={styles.content}>
						<StatusBar translucent={true} 
							backgroundColor={'rgba(0, 0, 0, 0.4)'} />
						<ScrollView style={styles.scroll}>
							<View style={styles.imageGrid}>
								{ this.state.images.map(image => {
									return (
										<TouchableOpacity key={image.uri} 
											style={styles.touch} 
											onPress={() => this._selectImage(image.uri)}>
											<Image style={styles.image} 
												source={{ uri: image.uri }} />
										</TouchableOpacity>
									);
								}) }
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
		height: '130%', //Fixes pattern bug
	},
	imageGrid: {
		padding: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		paddingBottom: 88 + 5
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
	content: {
		flex: 1,
	},
	scroll: {
		paddingTop: 88,
	}
});

export default SchoolScheduleSelectPicture;