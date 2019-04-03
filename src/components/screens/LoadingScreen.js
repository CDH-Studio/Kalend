import React from 'react';
import { StatusBar, View, Animated, Easing, Platform } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import AnimatedGradient from '../AnimatedGradient';
import { WelcomeScreen, LoginNavigator, DashboardOptionsNavigator } from '../../constants/screenNames';
import { gradientColors } from '../../../config';
import { loadingStyles as styles, blue, statusBarDark } from '../../styles';

const logoFile = require('../../assets/logoAnim.json');
const gradientAnimDuration = 2250;
const logoAnimDuration = 3000;

/**
 * The logo animation screen when the application is opened.
 */
class LoadingScreen extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			colors: [blue, blue],
			animProgress: new Animated.Value(0),
			nextScreen: WelcomeScreen
		};

		// Waits for the animation to finish, then goes to the next screen
		setTimeout(()=> {
			this.props.navigation.navigate(this.state.nextScreen);
		}, logoAnimDuration);
	}

	componentDidMount() {
		// Creates an animated value store at this.state.progress
		Animated.timing(this.state.animProgress, {
			toValue: 1,
			duration: gradientAnimDuration,
			easing: Easing.linear,
		}).start();

		// Sets the desired gradient, for it to be animated
		this.setState({
			colors: gradientColors
		});
	}

	componentWillMount() {
		// Checks which main screen was last accessed and changes
		// the next screen to that screen
		switch (this.props.main) {
			case 'Home':
				this.setState({
					nextScreen: LoginNavigator
				});
				break;
			case 'SchoolSchedule':
				this.setState({
					nextScreen: DashboardOptionsNavigator,
				});
				break;
			case 'Dashboard':
				// Checks if the user is logged in, if so the next screen
				// is the dashboard, otherwise its the login screen
				if (this.props.profile !== null) {
					this.setState({
						nextScreen: DashboardOptionsNavigator
					});
				}
				break;
		}
	}

	render() {
		const { colors, animProgress } = this.state;
		return(
			<View style={styles.container}>
				<AnimatedGradient
					style={{ flex: 1,}}
					colors={colors}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}/>

				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={statusBarDark} />
				
				<View style={styles.animView}>
					<LottieView progress={animProgress}
						loop={false}
						source={logoFile}/>
				</View>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		main: state.NavigationReducer.main, 
		profile: state.HomeReducer.profile
	};
};

export default connect(mapStateToProps, null)(LoadingScreen);