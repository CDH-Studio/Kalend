import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import { calendarEventColors } from '../../config';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SET_NAV_SCREEN} from '../constants';
import { store } from '../store';

class EventOverview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			deleteDialogVisible: false,
		};
	}

	//In order for the info modal to not stay open when on edit screen
	navigateAndCloseModal = (editScreen) => {
		this.setState({modalVisible: false});
		this.props.navigateEditScreen(editScreen);
	}

	//To delete the event from the database and delete the component
	deleteEvent = () => {
		//TODO Add method to delete event (component and database)
		this.setState({deleteDialogVisible: false, modalVisible: false});
		this.props.action(this.props.id, this.props.category);
	}

	render() {
		let categoryColor;
		let categoryIcon;
		let details;
		let editScreen;

		if(this.props.category === 'SchoolSchedule') {
			categoryColor = calendarEventColors.red;
			categoryIcon = 'school';
			details = 
				<View style={styles.modalDetailView}>
					<Text style={styles.modalDetailsSubtitle}>Location: </Text>
					<Text style={styles.modalDetailsText}>{this.props.location}</Text>
				</View>;

			editScreen = 'Course';
		}else if (this.props.category === 'FixedEvent') {
			categoryColor = calendarEventColors.green;
			categoryIcon = 'calendar-today';
			details = 
				<View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Location: </Text>
						<Text style={styles.modalDetailsText}>{this.props.location}</Text>
					</View>

					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Description: </Text>
						<Text style={styles.modalDetailsText}>{this.props.description}</Text>
					</View>

					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Recurrence: </Text>
						<Text style={styles.modalDetailsText}>{this.props.recurrence}</Text>
					</View>
				</View>;
			editScreen = 'FixedEvent';
		}else {
			categoryColor = calendarEventColors.purple;
			categoryIcon = 'face';
			details = 
				<View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Recurrence: </Text>
						<Text style={styles.modalDetailsText}>{this.props.recurrence}</Text>
					</View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Priority Level: </Text>
						<Text style={styles.modalDetailsText}>{this.props.priorityLevel}</Text>
					</View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Location: </Text>
						<Text style={styles.modalDetailsText}>{this.props.location}</Text>
					</View>
					<View style={styles.modalDetailView}>
						<Text style={styles.modalDetailsSubtitle}>Description: </Text>
						<Text style={styles.modalDetailsText}>{this.props.description}</Text>
					</View>
				</View>;
			editScreen = 'NonFixedEvent';
		}

		return(
			<View style={styles.container}>
				<TouchableOpacity onPress={() => {
					this.setState({modalVisible: true});
					store.dispatch({
						... store.getState().NavigationReducer,
						type: SET_NAV_SCREEN,
						reviewEventSelected: this.props.id
					});
				}}>
					<View style={styles.info}>
						<View style={[styles.category, {backgroundColor: categoryColor}]}>
							<Text></Text>
						</View>
						<View>
							<Text style={styles.eventTitle} numberOfLines={1}>{this.props.eventTitle}</Text>
							<Text style={styles.eventInfo}>{this.props.date}</Text>
							<Text style={styles.eventInfo}>{this.props.time}</Text>
						</View>
					</View>
				</TouchableOpacity>

				<View style={styles.actions}>
					<TouchableOpacity onPress={() => {
						this.props.navigateEditScreen(editScreen);
							
						store.dispatch({
							... store.getState().NavigationReducer,
							type: SET_NAV_SCREEN,
							reviewEventSelected: this.props.id
						});
					}}>
						<Feather name="edit" size={30} color="#565454" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.setState({deleteDialogVisible: true})}>
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

							<View style={styles.modalInfoView}>
								<View>
									<View style={styles.modalInfoDate}>
										<Text style={styles.modalInfoTitle}>Date(s): </Text>
										<Text style={styles.modalInfoText}>{this.props.date}</Text>
									</View>
									<View style={styles.modalInfoTime}>
										<Text style={styles.modalInfoTitle}>Time: </Text>
										<Text style={styles.modalInfoText}>{this.props.time}</Text>
									</View>
								</View>
								
								<MaterialCommunityIcons name={categoryIcon} size={80} color="#565454"/>
							</View>

							<View style={styles.modalDetailsView}>
								<Text style={styles.modalDetailsTitle}>Details</Text>
								{details}
							</View>
							
							<View style={styles.actionsModal}>
								<TouchableOpacity style={styles.actionIconModal} onPress={() => this.navigateAndCloseModal(editScreen)}>
									<Feather name="edit" size={40} color="#565454" />
								</TouchableOpacity>

								<TouchableOpacity style={styles.actionIconModal} onPress={() => this.setState({deleteDialogVisible: true})}>
									<Feather name="trash" size={40} color="#565454" />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Modal visible={this.state.deleteDialogVisible}
					transparent={true}
					onRequestClose={() => {
						//do nothing;
					}}
					animationType={'slide'}>
					<View style={styles.modalView}>
						<View style={styles.deleteDialogContent}>
							<View style={styles.deleteDialogMainRow}>
								<Feather name="trash" size={80} color="#565454" />

								<View style={styles.deleteDialogRightCol}>
									<Text style={styles.deleteDialogQuestion}>Delete this event?</Text>

									<View style={styles.deleteDialogOptions}>
										<TouchableOpacity onPress={() => this.setState({deleteDialogVisible: false})}>
											<Text style={styles.deleteDialogCancel}>Cancel</Text>
										</TouchableOpacity>

										<TouchableOpacity onPress={this.deleteEvent}>
											<Text style={styles.deleteDialogYes}>Yes</Text>
										</TouchableOpacity>
									</View>
								</View>
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
		width: '100%',
		height: 70,
		marginVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		elevation: 4
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 70
	},

	eventTitle: {
		width: 180,
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
		justifyContent: 'space-between',
		backgroundColor: 'white',
		borderRadius: 8,
		marginHorizontal: 20
	},

	closeModal: {
		flexDirection:'row',
		justifyContent:'flex-end',
		paddingHorizontal: 15,
		paddingVertical: 10
	},

	modalInfoDate: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		width: 160
	},

	modalInfoTime: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap'
	},

	modalDetailView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center'
	},

	modalTitle: {
		backgroundColor: '#FF9F1C',
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexWrap: 'wrap',
		fontSize: 18,
		fontFamily: 'OpenSans-SemiBold',
		color: 'white'
	},

	modalInfoView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 20
	},

	modalInfoTitle: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 16,
		paddingVertical: 3
	},

	modalInfoText: {
		fontSize: 15,
		fontFamily: 'OpenSans-Regular',
		paddingVertical: 3
	},

	modalDetailsView: {
		paddingHorizontal: 20
	},

	modalDetailsTitle: {
		fontSize: 16,
		textDecorationLine: 'underline',
		fontFamily: 'Raleway-SemiBold',
		paddingVertical: 1
	},
	
	modalDetailsSubtitle: {
		fontSize: 15,
		fontFamily: 'Raleway-SemiBold',
		paddingVertical: 1
	},

	modalDetailsText: {
		fontSize: 15,
		fontFamily: 'OpenSans-Regular',
		paddingVertical: 1
	},

	actionsModal: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 10,
		backgroundColor: 'white',
	},

	actionIconModal: {
		paddingHorizontal: 20
	},

	deleteDialogContent: {
		backgroundColor: 'white',
		borderRadius: 8,
		justifyContent: 'space-between',
		padding: 10
	},

	deleteDialogMainRow: {
		flexDirection: 'row'
	},

	deleteDialogRightCol: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingRight: 10
	},

	deleteDialogQuestion: {
		fontSize: 20,
		fontFamily: 'Raleway-SemiBold',
		marginLeft: 10
	},

	deleteDialogOptions: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},

	deleteDialogCancel: {
		fontFamily: 'Raleway-SemiBold',
		fontSize:16
	},

	deleteDialogYes: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: 16,
		color: 'red',
		marginLeft: 20
	}

});