import React from 'react';
import {Button} from 'react-native';

class ReviewEvent extends React.Component {
	render() {
		return(
			<Button title='Next' onPress={()=>this.props.navigation.navigate('ScheduleSelection')}>ReviewEvent Screen</Button>
		);
	}
}

export default ReviewEvent;