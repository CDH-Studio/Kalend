import React from 'react';
import {StatusBar, Text, View} from 'react-native';

class EditSchoolSchedule extends React.Component {
	render() {
		return(
			<View style={{width: '100%', height: '100%', paddingTop:100}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />

				<Text>Chatbot Screen</Text>

			</View>
		);
	}
}


export default EditSchoolSchedule;