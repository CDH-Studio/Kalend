import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform, StatusBar, NativeModules, LayoutAnimation } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {connect} from 'react-redux';
import { blueColor, orangeColor, redColor } from '../../../config';
import Entypo from 'react-native-vector-icons/Entypo';
import updateNavigation from '../NavigationHelper';
import { analyzePicture } from '../../services/service';

// Enables the LayoutAnimation on Android
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class SchoolScheduleTakePicture extends React.Component {

	static navigationOptions = {
		title: 'Take a Picture',
		headerTintColor: '#ffffff',
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
		
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

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

	enterAnimation = (icon) => {
		this.animation(1, 35, icon);
	}

	exitAnimation = (icon) => {
		this.animation(0, 0, icon);
	}

	componentDidMount() {
		setTimeout(()=>{
			this.enterAnimation(false);
		}, 800);
	}

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
				console.log('Image selected >> ' + this.state.base64);
				
				let fakeEscape = this.state.base64.replace(/[+]/g,'PLUS');
				fakeEscape = fakeEscape.replace(/[=]/g,'EQUALS');
				analyzePicture({data: fakeEscape});
				
				this.props.dispatch({
					type:'SET_IMG',
					hasImage: false
				});

				this.props.navigation.navigate('TutorialSchoolScheduleCreation');
			}
		}
	}

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

				<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.6)'} />

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
							style={[styles.capture, { backgroundColor: redColor}]}>

							<Entypo name='cross' 
								size={dismissIcon}
								color="#FFFFFF" 
								style={styles.icon} />

						</TouchableOpacity>
					</View>

					<View style={{opacity: takePictureOpacity}}>
						<TouchableOpacity onPress={this.takePicture}
							style={[styles.capture, {backgroundColor: changeIcon ? orangeColor : blueColor }]}>

							<Entypo name={changeIcon ? 'upload' : 'camera'} 
								size={takePictureIcon} 
								color="#FFFFFF" 
								style={styles.icon} />

						</TouchableOpacity>
					</View>

				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'black'
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	capture: {
		flex: 0,
		padding: 15,
		borderRadius: 50,
		margin: 20,
		alignSelf: 'center',
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 2,    
			},
			android: {
				elevation: 5,
			},
		}),
	},
	icon: {
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10
	}, 
	buttonContainer: { 
		justifyContent: 'center', 
		alignItems: 'center',
		position: 'absolute',
		right: 0,
		left: 0,
		bottom: 0 
	}
});

export default connect()(SchoolScheduleTakePicture);
