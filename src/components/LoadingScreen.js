import React from 'react';
import { StyleSheet, StatusBar, View} from 'react-native';
import LottieView from 'lottie-react-native';

class LoadingScreen extends React.Component {

	constructor(props) {
		super(props);
		setTimeout(()=> {
			this.props.navigation.navigate('LoginNavigator');
		}, 3000);
	}

	componentDidMount() {
		this.animation.play();
	}
	
	render() {
		return(
			<View style={styles.container}>
				<StatusBar translucent={true} backgroundColor={'#00000050'} />
				<LottieView
					ref={animation => {
						this.animation = animation;
					}}
					source={require('../assets/logoAnim.json')}
					loop={false}
					speed={0.75}
					style={{height:200, width:200}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1473E6',
	},
});

export default LoadingScreen;