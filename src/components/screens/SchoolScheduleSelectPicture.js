import React from 'react';
import { ScrollView, View, StatusBar, ActivityIndicator, Text, Platform, NativeModules } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import updateNavigation from '../NavigationHelper';
import { setImageURI } from '../../actions';
import CameraRollImage from '../CameraRollImage';
import { SchoolScheduleCreationRoute } from '../../constants/screenNames';
import { selectPictureStyles as styles, white, blue } from '../../styles';
import { getStrings } from '../../services/helper';
import CameraRoll from '@react-native-community/cameraroll';

// Enables the LayoutAnimation on Android
const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const imagesPerLoad = 99;

/**
 * Camera roll screen to let the user select a schedule
 */
class SchoolScheduleSelectPicture extends React.PureComponent {

	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.state.params.title,
			headerTransparent: true,
		};
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
				first: imagesPerLoad, 
				assetType: 'Photos',
				...Platform.OS === 'ios' ? {
					groupTypes: 'All'
				} : {}
			},
			showFAB: false,
			loadingAnimationValue: 0,
			selectedStyle: [],
			prevIndex: '',
			index: 0,
			activityIndicatorContent: <ActivityIndicator style={{padding:15}} size="large" color={white} />,
			showNoPhotos: false
		};
		
		// Updates the navigation location in redux
		updateNavigation('SchoolScheduleSelectPicture', props.navigation.state.routeName);
	}

	componentDidMount() {
		// Shows the loading 
		this.setState({
			activityIndicator: this.state.activityIndicatorContent
		});

		// Loads the photos
		this.getPhotos();

		// Checks if there are photos that loaded
		if (!this.state.pageInfo.has_next_page && this.state.images.length === 0) {
			this.setState({
				activityIndicator: null,
				showNoPhotos: true
			});
		}
	}

	/**
	 * Gets the photos URI and more information about the number of 
	 * images from the phone and stores it in the state
	 */
	getPhotos = () => {
		CameraRoll.getPhotos(this.state.fetchParams)
			.then((data) => {
				
				// Adds to the existing array of images the newly fetched images
				let images = this.state.images;
				images.push.apply(images, data.edges.map((edge) => edge.node.image));

				// Adds the same number of newly fetched images to the selectedStyle array
				// to keep track of the images that has been pressed
				this.state.selectedStyle.push.apply(this.state.selectedStyle, Array(data.edges.length).fill(0));

				// Updates the information in the state related to the phones camera roll
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

	/**
	 * Scroll listener to know when the user is at the bottom of the scrollView
	 */
	scrollListener = (event) => {
		event = event.nativeEvent;
		if (parseInt(event.contentOffset.y + event.layoutMeasurement.height) === parseInt(event.contentSize.height)) {
			this.atTheBottom(true);
		}
		this.atTheBottom(false);
	}

	/**
	 * Loads more photos if the user is at the bottom of the scrollView and there are other photos
	 * 
	 * @param {Boolean} bool True if the user is at the bottom of the scrollView, false otherwise
	 */
	atTheBottom = (bool) => {
		if (bool && this.state.pageInfo.has_next_page) {
			this.getPhotos();
		}
	}
	
	/**
	 * Handles every situation when the user selects an image
	 */
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

	/**
	 * Method passed to child image component to update which image has been selected
	 * 
	 * @param {Object} data The object with the newly information
	 * @param {String} data.selected The image URI that has been selected
	 * @param {Integer} data.index The id of the image that has been selected
	 */
	onUpdate = (data) => {
		this.setState({
			selected: data.selected,
			index: data.index
		});
		this.selectImage(data.index);
	}

	/**
	 * Updates the content in redux with the selected image URI
	 * 
	 * @param {String} imgURI The URI of the image that will be stored in redux
	 */
	setImage = (imgURI) => {
		this.props.dispatch(setImageURI(imgURI, true));
	}

	/**
	 * Goes to the next screen
	 */
	nextScreen = () => {
		this.setImage(this.state.selected);
	
		this.props.navigation.navigate(SchoolScheduleCreationRoute, {title: getStrings().SchoolScheduleCreation.title});
	}

	render() {
		const { images, showFAB, activityIndicator, selectedStyle, showNoPhotos } = this.state;

		return (
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'rgba(0, 0, 0, 0.6)'} />
					
				<ScrollView onScroll={this.scrollListener}>
					<View style={styles.content}>
						<View style={styles.imageGrid}>
							{ 
								images.map((image, index) => {
									return (
										<CameraRollImage key={index}
											image={image} 
											index={index} 
											onUpdate={this.onUpdate}
											selectedStyle={selectedStyle[index]} />
									);
								}) 
							}

							{ activityIndicator }

							{ 
								showNoPhotos ? 
									<View style={styles.emptyView}>
										<Ionicons
											name="ios-images" 
											size={50} 
											color={white} />

										<Text style={styles.emptyText}>There are no photos on{'\n'}your device</Text>
									</View> : null
							}
						</View>
					</View>
				</ScrollView>
				
				<FAB style={styles.fab}
					icon="file-upload"
					theme={{colors:{accent:blue}}}
					visible={showFAB}
					onPress={this.nextScreen} />
			</View>
		);
	}
}

export default connect()(SchoolScheduleSelectPicture);