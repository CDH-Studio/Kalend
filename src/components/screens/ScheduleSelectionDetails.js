import React from 'react';
import {Text, Platform, StatusBar, View, StyleSheet} from 'react-native';
import { blueColor } from '../../../config';
import { FAB } from 'react-native-paper';

class ScheduleSelectionDetails extends React.Component {
	static navigationOptions = {
		title: 'First Schedule',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerStyle: {
			backgroundColor: blueColor,
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};
	
	render() {
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />
				<Text>ScheduleSelectionDetails Screen</Text>
				
				<FAB
					style={styles.fab}
					icon="check"
					onPress={() => this.props.navigation.navigate('DashboardNavigator')} />
			</View>
		);
	}
}

const styles = StyleSheet.create({

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default ScheduleSelectionDetails;