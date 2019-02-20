import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//TODO - Add onPress={() => this.props.navigation.navigate({this.props.editScreen})} to the Touchables

class EventOverview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
		};
	}

	render() {
		return(
			<View style={styles.container}>
				<TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
					<View style={styles.info}>
						<View style={[styles.category, {backgroundColor: this.props.category}]}>
							<Text></Text>
						</View>
						<View>
							<Text style={styles.eventTitle}>{this.props.eventTitle}</Text>
							<Text style={styles.eventInfo}>{this.props.date}</Text>
							<Text style={styles.eventInfo}>{this.props.time}</Text>
						</View>
					</View>
				</TouchableOpacity>

				<View style={styles.actions}>
					<TouchableOpacity>
						<Feather name="edit" size={30} color="#565454" />
					</TouchableOpacity>
					<TouchableOpacity>
						<Feather name="trash" size={30} color="#565454" />
					</TouchableOpacity>
				</View>



				<Modal visible={this.state.modalVisible}
					transparent={true}
					onRequestClose={() => {
						//do nothing;
					}}
					animationType={'slide'}>
					<View style={styles.modalView}>
						<View style={styles.modalContent}>
							<TouchableOpacity style={styles.closeModal} onPress={() => this.setState({modalVisible: false})}>
								<Feather name="x" size={30} color="#565454" />
							</TouchableOpacity>

							<Text style={styles.modalTitle}>{this.props.eventTitle}</Text>

							<View style={styles.modalInfo}>
								<View>
									<Text>Date(s): {this.props.date}</Text>
									<Text>Time: {this.props.time}</Text>
									<Text>Other Information:</Text>
								</View>
								
								<MaterialCommunityIcons name="school" size={80} color="#565454"/>
							</View>
							
							<View style={styles.actions}>
								<TouchableOpacity>
									<Feather name="edit" size={30} color="#565454" />
								</TouchableOpacity>

								<TouchableOpacity>
									<Feather name="trash" size={30} color="#565454" />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export default EventOverview;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		width: '100%',
		height: 70,
		elevation: 4,
		marginVertical: 10,
		paddingHorizontal: 10
	},

	info: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},

	category: {
		width: 20,
		height: 70,
		marginRight: 15
	},

	actions: {
		width: 70,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	eventTitle: {
		fontFamily: 'OpenSans-SemiBold',
		fontSize: 15
	},

	eventInfo: {
		fontFamily: 'OpenSans-Regular'
	},

	modalView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080',
		
	},

	modalContent: {
		width: '70%',
		height: '50%',
		backgroundColor: 'white',
		borderRadius: 8
	},

	closeModal: {
		flexDirection:'row',
		justifyContent:'flex-end',
		paddingHorizontal: 15,
		paddingVertical: 10
	},

	modalTitle: {
		backgroundColor: '#FF9F1C',
		fontSize: 18,
		fontFamily: 'OpenSans-SemiBold',
		paddingHorizontal: 20,
		color: 'white'
	},

	modalInfo: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 20
	},
	
});