import React from 'react';
import { StyleSheet, StatusBar, View, Animated, Easing} from 'react-native';
import LottieView from 'lottie-react-native';
import AnimatedGradient from '../AnimatedGradient';

const colors1 = ['#1473E6', '#1473E6'];
const colors2 = ['#1473E6', '#0E55AA'];

class LoadingScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			colors: colors1,
			progress: new Animated.Value(0),
		};
		
		setTimeout(()=> {
			this.props.navigation.navigate('LoginNavigator');
		}, 4000);
	}

	componentDidMount() {
		Animated.timing(this.state.progress, {
			toValue: 1,
			duration: 3000,
			easing: Easing.linear,
		}).start();

		this.setState({
			colors: colors2
		});
	}

	render() {
		const { colors } = this.state;
		return(
			<View style={styles.container}>
			
				<AnimatedGradient
					style={{ flex: 1,}}
					colors={colors}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}/>

				<StatusBar translucent={true} backgroundColor={'#00000050'} />
				
				<View style={styles.animView}>
				
					<LottieView
						progress={this.state.progress}
						source={require('../../assets/logoAnim.json')}
						loop={false}
						speed={0.75}
						style={styles.anim} />
				</View>
					
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	animView: {
		position:'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		height:'100%',
		width:'100%'
	},
	anim: {
		height:350, 
		width:350,
		flex: 1,
		alignSelf:'center' 
	}
});

export default LoadingScreen;