import React from 'react';
import {Text} from 'react-native';
import { analyzePicture } from '../../services/service';

class SchoolScheduleCreation extends React.Component {

	componentDidMount() {
		analyzePicture();
	}

	render() {
		return(
			<Text>It works!</Text>
		);
	}
}

export default SchoolScheduleCreation;