import React from 'react';
import { CameraRoll, Image, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar, Platform, Dimensions, ImageBackground, ActivityIndicator, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradientColors } from '../../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
			showFAB: false,
			loadingAnimationValue: 0,
			selectedStyle: Array(99).fill(1)
		};
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

	scrollListener = (event) => {
		event = event.nativeEvent;
		if (event.contentOffset.y + event.layoutMeasurement.height === event.contentSize.height) {
			this.atTheBottom(true);
		}
		this.atTheBottom(false);
	}

	atTheBottom = (bool) => {
		if (bool) {
			console.log("AT THE BOTTOM");
			
			let loop1 = setInterval(() => {
				this.setState({loadingAnimationValue: this.state.loadingAnimationValue + .2});
				if (this.state.loadingAnimationValue > 0.5) {
					clearInterval(loop1);
				}
			}, 1);
		} else if (this.state.loadingAnimation !== 0) {
			let loop2 = setInterval(() => {
				this.setState({loadingAnimationValue: this.state.loadingAnimationValue - .2});
				if (this.state.loadingAnimationValue < 0) {
					clearInterval(loop2);
				}
			}, 1);
		}
	}
	
	selectImage = (uri, index) => {
		this.setState({
			selected: uri,
			showFAB: true
		});

		console.log(index);

		this.state.selectedStyle[index] = 0.5;
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
						<ScrollView style={styles.scroll}
							onScroll={this.scrollListener}>
							<View style={styles.imageGrid}>
								{ this.state.images.map((image, index) => {
									return (
										<TouchableOpacity key={image.uri} 
											style={styles.touch} 
											onPress={() => this.selectImage(image.uri, index)}
											activeOpacity={0.7}>

											<Icon style={{opacity: 1,position:"absolute", bottom:0, right:0, padding: 5}} name="check" size={30} color="#ffffff" />
											
											<View style={{backgroundColor:'#232323',
												position:"absolute", 
												borderRadius: 5,
												height:Dimensions.get('window').width/3 - 14, 
												width:Dimensions.get('window').width/3 - 14,
												opacity: 2-this.state.selectedStyle[index]*2}}>
											</View>

											<Image style={styles.image} 
												source={{ uri: image.uri }} >
											</Image>
										</TouchableOpacity>
									);
								}) }
        						<ActivityIndicator style={{padding:15,opacity:this.state.loadingAnimationValue}} size="large" color="#ffffff" />
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
		backgroundColor: '#000',
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