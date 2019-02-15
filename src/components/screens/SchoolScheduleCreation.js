import React from 'react';
import {ImageBackground, StatusBar, Platform, StyleSheet, View, Dimensions} from 'react-native';
import { analyzePicture } from '../../services/service';
import { gradientColors } from '../../../config';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar, Colors, Surface } from 'react-native-paper';

class SchoolScheduleCreation extends React.Component {
	static navigationOptions = {
		title: 'Analysing Schedule',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'rgba(0, 0, 0, 0.2)',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	componentDidMount() {
		analyzePicture();
	}

	render() {
		return(
			<LinearGradient style={styles.container} colors={gradientColors}>
				<ImageBackground style={styles.container} source={require('../../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
					<StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.4)'} />


 				 <Surface style={styles.surface}>

						<ProgressBar style={{height: 10}}color={Colors.red800} />
		
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
		height: 80,
		width: Dimensions.get('window').width * 0.8,
		borderRadius: 4,
		justifyContent: 'center',
		elevation: 3,
	},
});

export default SchoolScheduleCreation;