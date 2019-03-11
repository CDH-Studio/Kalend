import React from 'react';
import { TouchableOpacity, View, Platform, StatusBar, NativeModules, LayoutAnimation } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import updateNavigation from '../NavigationHelper';
import { analyzePicture } from '../../services/service';
import { takePictureStyles as styles, orange, red, blue, white } from '../../styles';
import { setImageURI } from '../../actions';

const iconColor = 'white';

// Enables the LayoutAnimation on Android
const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

/**
 * The camera screen which allows the user to take a picture of their schedule
 * and upload it to the server to extract the information about their school schedule
 */
class SchoolScheduleTakePicture extends React.Component {

	static navigationOptions = {
		title: 'Take a Picture',
		headerTintColor: white,
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};
	
	constructor(props) {
		super(props);
		this.state = {
			base64: '',
			changeIcon: false,
			takePictureOpacity: 0,
			takePictureIcon: 0,
			dismissOpacity: 0,
			dismissIcon: 0
		};
		
		// Updates the navigation location in redux
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}
	
	componentDidMount() {
		// Creates an entrance animation for the blue button after the 
		setTimeout(()=>{
			this.enterAnimation(false);
		}, 800);
	}

	/**
	 * Animates the bottom icons
	 * 
	 * @param {Integer} opacity The desired opacity, which will be animated
	 * @param {Integer} size The desired size, which will be animated
	 * @param {Boolean} icon True if the two icons are animated, only one is animated otherwise
	 */
	animation = (opacity, size, icon) => {
		if (icon) {
			if (opacity === 1) {
				this.setState({
					dismissOpacity: opacity,
					takePictureOpacity: opacity
				});
			} else {
				setTimeout(() => {
					this.setState({
						dismissOpacity: opacity,
						takePictureOpacity: opacity
					});
				}, 100);
			}
			LayoutAnimation.spring();
			this.setState({
				dismissIcon: size,
				takePictureIcon: size,
			});
		} else {
			if (opacity === 1) {
				this.setState({
					takePictureOpacity: opacity
				});
			} else {
				setTimeout(() => {
					this.setState({
						takePictureOpacity: opacity
					});
				}, 100);
			}
			LayoutAnimation.spring();

			this.setState({
				takePictureIcon: size,
			});
		}
	}

	/**
	 * Helper method to animate an icon(s) on entrance
	 * 
	 * @param {Boolean} icon True if the two icons are animated, only one is animated otherwise
	 */
	enterAnimation = (icon) => {
		this.animation(1, 35, icon);
	}

	/**
	 * Helper method to animate an icon(s) on exit
	 * 
	 * @param {Boolean} icon True if the two icons are animated, only one is animated otherwise
	 */
	exitAnimation = (icon) => {
		this.animation(0, 0, icon);
	}

	/**
	 * Either takes the picture and saves it in the state or 
	 * converts the image to Python friendly BASE64, saves it in redux, then goes to the next screen
	 */
	takePicture = async () => {
		if (this.camera) {
			if (!this.state.changeIcon) {
				this.exitAnimation(false);

				const options = { quality: 0.5, base64: true, doNotSave: false, pauseAfterCapture: true };
				const data = await this.camera.takePictureAsync(options);
				this.setState({
					base64: data.base64,
					changeIcon: true,
				});

				this.enterAnimation(true);
			} else {
				let fakeEscape = this.state.base64.replace(/[+]/g,'PLUS');
				fakeEscape = fakeEscape.replace(/[=]/g,'EQUALS');
				analyzePicture({data: fakeEscape});
				
				this.props.dispatch(setImageURI(undefined, false));

				if(this.props.navigation.state.routeName === 'TutorialSchoolScheduleTakePicture') {
					this.props.navigation.navigate('TutorialSchoolScheduleCreation');
				}else {
					this.props.navigation.navigate('DashboardSchoolScheduleCreation');
				}
			}
		}
	}

	/**
	 * The cancel button onPress, which animates the removal of the two 
	 * icons (upload and dismiss) and the entrance of the take a picture icon
	 */
	cancelPicture = () => {
		this.exitAnimation(true);
		this.camera.resumePreview();
		this.setState({
			changeIcon: false,
		});
		setTimeout(() => this.enterAnimation(false), 200);
	}

	render() {
		const { changeIcon, takePictureOpacity, dismissOpacity, takePictureIcon, dismissIcon } = this.state;
		return (
			<View style={styles.container}>
				<StatusBar translucent={true} 
					backgroundColor={'rgba(0, 0, 0, 0.6)'} />

				<RNCamera captureAudio={false}
					ref={ref => {
						this.camera = ref;
					}}
					style={styles.preview}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.auto} />

				<View style={[styles.buttonContainer, {flexDirection: changeIcon ? 'row' : 'column'}]}>
					<View style={{opacity: dismissOpacity}}>
						<TouchableOpacity
							onPress={this.cancelPicture}
							style={[styles.capture, {backgroundColor: red}]}>
							<Entypo name='cross' 
								size={dismissIcon}
								color={iconColor} 
								style={styles.icon} />
						</TouchableOpacity>
					</View>

					<View style={{opacity: takePictureOpacity}}>
						<TouchableOpacity onPress={this.takePicture}
							style={[styles.capture, {backgroundColor: changeIcon ? orange : blue }]}>
							<Entypo name={changeIcon ? 'upload' : 'camera'} 
								size={takePictureIcon} 
								color={iconColor} 
								style={styles.icon} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

export default connect()(SchoolScheduleTakePicture);