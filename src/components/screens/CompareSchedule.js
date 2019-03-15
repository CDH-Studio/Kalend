import React from 'react';
import { StatusBar, View } from 'react-native';
import { compareScheduleStyles as styles } from '../../styles';

class CompareSchedule extends React.Component {
	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} backgroundColor={'#2d6986'} />
			</View>
		);
	}
}

export default CompareSchedule;