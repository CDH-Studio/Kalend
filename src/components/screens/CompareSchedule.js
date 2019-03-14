import React from 'react';
import { StatusBar, View } from 'react-native';
import { compareScheduleStyles as styles, statusBlueColor } from '../../styles';

class CompareSchedule extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={statusBlueColor} />
			</View>
		);
	}
}

export default CompareSchedule;