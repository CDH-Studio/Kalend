import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { compareScheduleStyles as styles, blue } from '../../styles';

class CompareSchedule extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={blue} />

				<Text>CompareSchedule Screen</Text>
				
			</View>
		);
	}
}

export default CompareSchedule;