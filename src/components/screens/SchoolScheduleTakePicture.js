import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { blueColor, orangeColor, redColor } from '../../../config';
import Entypo from 'react-native-vector-icons/Entypo';

class SchoolScheduleTakePicture extends React.Component {

	static navigationOptions = {
		title: 'Take A Picture',
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
		};
	}

	takePicture = async () => {
		if (this.camera) {
			if (!this.state.changeIcon) {
				const options = { quality: 0.5, base64: true, doNotSave: false, pauseAfterCapture: true };
				const data = await this.camera.takePictureAsync(options);
				this.setState({
					base64: data.base64,
					changeIcon: true,
				});
			} else {
				console.log('Image selected >> ' + this.state.base64);
				this.props.navigation.navigate('SchoolScheduleCreation');
			}
		}
	}

	cancelPicture = () => {
		this.camera.resumePreview();
		this.setState({
			changeIcon: false,
		});
	}

	render() {
		const { changeIcon } = this.state;
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

				<View style={styles.buttonContainer}>
					
					<TouchableOpacity onPress={this.takePicture}
						style={[styles.capture, {backgroundColor: changeIcon ? orangeColor : blueColor }]}>

						<Entypo name={changeIcon ? 'upload' : 'camera'} 
							size={35} 
							color="#FFFFFF" 
							style={styles.icon} />

					</TouchableOpacity>
					
					{ this.state.changeIcon ? 
						<TouchableOpacity
							onPress={this.cancelPicture}
							style={[styles.capture, {backgroundColor: redColor}]}>

							<Entypo name='cross' 
								size={35} 
								color="#FFFFFF" 
								style={styles.icon} />

						</TouchableOpacity>
						:
						null }

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
		flexDirection: 'row', 
		justifyContent: 'center', 
		position: 'absolute',
		right: 0,
		left: 0,
		bottom: 0 
	}
});

export default SchoolScheduleTakePicture;
