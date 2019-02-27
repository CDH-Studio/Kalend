import React from 'react';
import { StyleSheet, StatusBar, View, Animated, Easing} from 'react-native';
import { gradientColors, blueColor } from '../../../config';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import AnimatedGradient from '../AnimatedGradient';

class LoadingScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			colors: [blueColor, blueColor],
			progress: new Animated.Value(0),
			nextScreen: 'WelcomeScreen'
		};

		setTimeout(()=> {
			this.props.navigation.navigate(this.state.nextScreen);
		}, 3000);
	}

	componentDidMount() {
		Animated.timing(this.state.progress, {
			toValue: 1,
			duration: 2250,
			easing: Easing.linear,
		}).start();

		this.setState({
			colors: gradientColors
		});
	}

	componentWillMount() {
		console.log(this.props);
		switch (this.props.main) {
			case 'Home':
				this.setState({
					nextScreen: 'LoginNavigator'
				});
				break;
			case 'SchoolSchedule':
				this.setState({
					nextScreen: 'TutorialNavigator'
				});
				break;
			case 'Dashboard':
				if (this.props.profile !== null) {
					this.setState({
						nextScreen: 'DashboardOptionsNavigator'
					});
				}
				break;
		}
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
						speed={1}
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

function mapStateToProps(state) {
	const main = state.NavigationReducer.main;
	const profile = state.HomeReducer.profile;
	return {
		main, 
		profile
	};
}

export default connect(mapStateToProps, null)(LoadingScreen);