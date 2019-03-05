import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { blueColor } from '../../../config';
import { compareScheduleStyles as styles } from '../../styles';

class CompareSchedule extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={blueColor} />

				<Text>CompareSchedule Screen</Text>
				
			</View>
		);
	}
}

export default CompareSchedule;