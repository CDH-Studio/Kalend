import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { calendarEventColors, grayColor } from '../../config';
import { SET_NAV_SCREEN } from '../constants';
import { store } from '../store';
import { eventOverviewStyles as styles } from '../styles';

/**
 * Permits the user to get more information on their events in the Review Events screen
 */
class EventOverview extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false,
			deleteDialogVisible: false,
		};
	}
	
	/**
	 * In order for the info modal to not stay open when on edit screen */
	navigateAndCloseModal = (editScreen) => {
		this.setState({modalVisible: false});
		this.props.navigateEditScreen(editScreen);
	}

	/**
	 * To delete the event from the database and delete the component */
	deleteEvent = () => {
		this.setState({deleteDialogVisible: false, modalVisible: false});
		this.props.action(this.props.id, this.props.category);
	}

	render() {
		let categoryColor;
		let categoryIcon;
		let details;
		let editScreen;

		if (this.props.category === 'SchoolSchedule') {
			categoryColor = calendarEventColors.red;

			categoryIcon = 'school';

			details = 
				<View style={styles.modalDetailView}>
					<Text style={styles.modalDetailsSubtitle}>Location: </Text>
					<Text style={styles.modalDetailsText}>{this.props.location}</Text>
				</View>;

			editScreen = 'Course';
		} else if (this.props.category === 'FixedEvent') {
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
		} else {
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
						<Feather name="edit" size={30} color={grayColor} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.setState({deleteDialogVisible: true})}>
						<Feather name="trash" size={30} color={grayColor} />
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
								<Feather name="x" size={30} color={grayColor} />
							</TouchableOpacity>

							<Text style={[styles.modalTitle, {backgroundColor: categoryColor} ]}>{this.props.eventTitle}</Text>

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
								
								<MaterialCommunityIcons name={categoryIcon} size={80} color={grayColor} />
							</View>

							<View style={styles.modalDetailsView}>
								<Text style={styles.modalDetailsTitle}>Details</Text>
								{details}
							</View>
							
							<View style={styles.actionsModal}>
								<TouchableOpacity style={styles.actionIconModal} onPress={() => this.navigateAndCloseModal(editScreen)}>
									<Feather name="edit" size={40} color={grayColor} />
								</TouchableOpacity>

								<TouchableOpacity style={styles.actionIconModal} onPress={() => this.setState({deleteDialogVisible: true})}>
									<Feather name="trash" size={40} color={grayColor} />
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
								<Feather name="trash" size={80} color={grayColor} />

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