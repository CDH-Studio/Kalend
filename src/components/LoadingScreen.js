import React from 'react';
import { StyleSheet, StatusBar, View, Animated, Easing} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

class GradientHelper extends React.Component {
	render() {
		const {
			style,
			color1,
			color2,
			start = { x: 0, y: 0 },
			end = { x: 0, y: 1 }
		} = this.props;
		return (
			<LinearGradient
				colors={[color1, color2]}
				start={start}
				end={end}
				style={style}>

			</LinearGradient>
		);
	}
}

const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper);

class AnimatedGradient extends React.Component {
	constructor(props) {
		super(props);

		const { colors } = props;
		this.state = {
			prevColors: colors,
			colors,
			tweener: new Animated.Value(0)
		};
	}

	componentDidUpdate() {
		const {tweener} = this.state;
		Animated.timing(tweener, {
			toValue: 1,
			duration: 3000
		}).start();
	}

	static getDerivedStateFromProps(props, state) {
		const {colors: prevColors} = state;
		const {colors} = props;
		const tweener = new Animated.Value(0);
		return {
			prevColors,
			colors,
			tweener
		};
	}

	render() {
		const { tweener, prevColors, colors } = this.state;
	
		const { style } = this.props;
	
		const color1Interp = tweener.interpolate({
			inputRange: [0, 1],
			outputRange: [prevColors[0], colors[0]]
		});
	
		const color2Interp = tweener.interpolate({
			inputRange: [0, 1],
			outputRange: [prevColors[1], colors[1]]
		});
	
		return (
			<AnimatedGradientHelper
				style={style || styles.component}
				color1={color1Interp}
				color2={color2Interp}
			/>
		);
	}
}

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
						source={require('../assets/logoAnim.json')}
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