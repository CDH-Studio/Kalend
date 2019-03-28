import React from 'react';
import { Modal, View, Text, ScrollView } from 'react-native';

class DebugAlert extends React.Component {
	state = {
		modalVisible: true
	};

	render() {
		return(
			<View>
				<Modal visible={this.state.modalVisible}
					transparent>
					<View style={{margin: 30, backgroundColor: 'white'}}>
						<Text style={{fontSize: 20}}>{this.props.title}</Text>
						<ScrollView>
							<Text>{this.props.info}</Text>
						</ScrollView>
						<Text onPress={() => this.setState({modalVisible: false})}>DISMISS</Text>
					</View>
				</Modal>
			</View>
		);
	}
}

export default DebugAlert;