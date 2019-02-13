import React from 'react';
import { CameraRoll, Image, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar, Platform, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradientColors } from '../../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';

class CameraRollImage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			image: this.props.image,
			index: this.props.index,
			selectedStyle: this.props.selectedStyle
		};
	}

	update = (selected, index) => {
		console.log(this.props.selectedStyle);
		this.props.onUpdate({selected, index});
	}

	render () {
		
		const {image, index, selectedStyle} = this.props;
		return (
			<View>
				<View style={
					[styles.image, styles.touch, {backgroundColor:'#232323',
						position:'absolute', 
						opacity: 0.4}]}/>
				<TouchableOpacity
					style={[styles.touch, {scaleX: 1 - 0.2 * selectedStyle, scaleY: 1 - 0.2 * selectedStyle}]} 
					onPress={() => this.update(image.uri, index)}
					activeOpacity={0.7}>

					<Image style={styles.image} 
						source={{ uri: image.uri }} >
					</Image>

					<Icon style={[styles.icon, 
						{opacity: selectedStyle,
							textShadowColor: 'rgba(0, 0, 0, 0.40)',
							textShadowOffset: {width: -1, height: 1},
							textShadowRadius: 20}]} 
					name="checkbox-blank-circle" 
					size={35} 
					color="#FF9F1C" />
					<Icon style={[styles.icon, {opacity: selectedStyle, bottom: -10, right: -10, }]} 
						name="check" 
						size={25} 
						color="#764D16" />

				</TouchableOpacity>
			</View>
		);
	}
}

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
			pageInfo: {
				has_next_page: true
			},
			images: [],
			selected: '',
			fetchParams: { 
				first: 99, 
				assetType: 'Photos',
			},
			showFAB: false,
			loadingAnimationValue: 0,
			selectedStyle: [],
			prevIndex: '',
			index: 0,
			activityIndicatorContent: <ActivityIndicator style={{padding:15}} size="large" color="#ffffff" />,
		};
	}

	componentDidMount() {
		this.setState({
			activityIndicator: this.state.activityIndicatorContent
		});

		this.getPhotos();
	}

	getPhotos = () => {
		CameraRoll.getPhotos(this.state.fetchParams)
			.then((data) => {
				let images = this.state.images;
				images.push.apply(images, data.edges.map((edge) => edge.node.image));

				this.state.selectedStyle.push.apply(this.state.selectedStyle, Array(data.edges.length).fill(0));

				this.setState({
					images,
					pageInfo: data.page_info,
					activityIndicator: data.page_info.has_next_page ? this.state.activityIndicatorContent : <View/>,
					fetchParams: {
						first: this.state.fetchParams.first,
						assetType: this.state.fetchParams.assetType,
						after: data.page_info.end_cursor
					},
				});
			})
			.catch((error) => console.log(error));
	}

	scrollListener = (event) => {
		event = event.nativeEvent;
		if (parseInt(event.contentOffset.y + event.layoutMeasurement.height) === parseInt(event.contentSize.height)) {
			this.atTheBottom(true);
		}
		this.atTheBottom(false);
	}

	atTheBottom = (bool) => {
		if (bool) {
			console.log("AT THE BOTTOM");

			if (this.state.pageInfo.has_next_page) {
				this.getPhotos();
			}
		}
	}
	
	selectImage = (index) => {
		if (this.state.prevIndex !== '') {
			if (index === this.state.prevIndex) {
				if (this.state.selectedStyle[index] === 1) {
					this.state.selectedStyle[index] = 0;
				} else {
					this.state.selectedStyle[index] = 1;
				}
			} else if (this.state.selectedStyle[this.state.prevIndex] === 1) {
				this.state.selectedStyle[this.state.prevIndex] = 0;
				this.state.selectedStyle[index] = 1;
			} else {
				this.state.selectedStyle[index] = 1;
			}
		} else {
			this.state.selectedStyle[index] = 1;
		}

		if (this.state.selectedStyle[index] === 1) {
			this.state.showFAB = true;
		} else {
			this.state.showFAB = false;
		}
		
		this.setState({
			prevIndex: index
		});
	}

	onUpdate = (data) => {
		this.setState({data});
		this.selectImage(data.index);
	}

	uploadImage = () => {
		console.log("Image selected >> " + this.state.selected);
		this.props.navigation.navigate('SchoolScheduleCreation');
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
										<CameraRollImage key={index}
											image={image} 
											index={index} 
											onUpdate={this.onUpdate.bind(this)}
											selectedStyle={this.state.selectedStyle[index]} />
									);
								}) }

        						{this.state.activityIndicator}
							</View>
							
						</ScrollView>
						
						<FAB style={styles.fab}
							icon="file-upload"
							visible={this.state.showFAB}
							onPress={this.uploadImage} />

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
	},
	icon: {
		position: 'absolute', 
		bottom: -15, 
		right: -15, 
		padding: 5,
	}
});

export default SchoolScheduleSelectPicture;