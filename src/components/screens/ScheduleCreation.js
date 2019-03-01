import React from 'react';
import {StatusBar, Text, StyleSheet, Dimensions, ImageBackground} from 'react-native';
import { gradientColors, orangeColor, lightOrangeColor } from '../../../config';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import { Surface } from 'react-native-paper';

class ScheduleCreation extends React.Component {

	static navigationOptions = {
		header: null,
	};

	componentWillMount() {
		setTimeout(() => {
			this.navigateToSelection();
		}, 2000);
	}

	navigateToSelection = () => {
		if(this.props.navigation.state.routeName === 'TutorialScheduleCreation') {
			this.props.navigation.navigate('TutorialScheduleSelection');
		}else {
			this.props.navigation.navigate('DashboardScheduleSelection');
		}
	}
  
	render() {
		return(
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.2)'} />
					<Surface style={styles.surface}>
						<Text style={styles.title}>Creating your Schedule</Text>
						<Text style={styles.subtitle}>Our AI is now perfecting multiple schedule for you</Text>

						<Progress.Bar style={{alignSelf:'center'}} indeterminate={true} width={200} color={orangeColor} useNativeDriver={true} borderColor={orangeColor} unfilledColor={lightOrangeColor}/>
					</Surface>
				</ImageBackground>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	surface: {
		padding: 8,
		height: 110,
		width: Dimensions.get('window').width * 0.8,
		borderRadius: 4,
		justifyContent: 'center',
		elevation: 3,
	},

	title: {
		fontSize: 20,
		fontFamily: 'Raleway-Regular',
		textAlign: 'center'
	},

	subtitle: {
		fontFamily: 'Raleway-Regular',
		textAlign: 'center',
		paddingTop: 5,
		paddingBottom: 10
	}
});


export default ScheduleCreation;