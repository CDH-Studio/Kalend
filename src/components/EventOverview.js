import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setNavigationScreen } from '../actions';
import { calendarEventColors, grayColor } from '../../config';
import { store } from '../store';
import { eventOverviewStyles as styles } from '../styles';


/**
 * Permits the user to get more information on their events in the Review Events screen
 * @prop {Number} key The key of the event
 * @prop {Number} id The id of the event
 * @prop {String} category The category of the event
 * @prop {String} eventTitle The title of the event
 * @prop {String} date The dates of the event
 * @prop {String} time The time of the event
 * @prop {String} location The location of the event
 * @prop {String} description The description of the event
 * @prop {String} recurrence The recurrence of the event
 * @prop {String} priorityLevel The priority level of the event
 * @prop {String} navigateEditScreen The appropriate edit screen for the event
 * @prop {function} action The function to be executed when delete is triggered
 */
class EventOverview extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false,
			deleteDialogVisible: false,
		};
	}
	
	/**
	 * In order for the info modal to not stay open when on edit screen 
	 */
	navigateAndCloseModal = (editScreen) => {
		this.setState({modalVisible: false});
		this.props.navigateEditScreen(editScreen);
	}

	/**
	 * To delete the event from the database and delete the component 
	 */
	deleteEvent = () => {
		this.setState({deleteDialogVisible: false, modalVisible: false, edited: false});
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
					store.dispatch(setNavigationScreen({
						... store.getState().NavigationReducer,
						reviewEventSelected: this.props.id
					}));
				}}
				style={{width:'100%'}}>
					<View style={styles.info}>
						<View style={[styles.category, {backgroundColor: categoryColor}]}>
							<Text></Text>
						</View>
						<View>
							<Text style={styles.eventTitle}
								numberOfLines={1}>{this.props.eventTitle}</Text>
							<Text style={styles.eventInfo}
								numberOfLines={1}>{this.props.date}</Text>
							<Text style={styles.eventInfo}
								numberOfLines={1}>{this.props.time}</Text>
						</View>
					</View>
					<View style={styles.actions}>
						<TouchableOpacity onPress={() => {
							this.props.navigateEditScreen(editScreen);
								
							store.dispatch(setNavigationScreen({
								... store.getState().NavigationReducer,
								reviewEventSelected: this.props.id
							}));
						}}>
							<MaterialCommunityIcons name="square-edit-outline"
								size={30}
								color={grayColor} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.setState({deleteDialogVisible: true})}
							style={{marginLeft: 10}}>
							<MaterialCommunityIcons name="trash-can-outline"
								size={30}
								color={grayColor} />
						</TouchableOpacity>
					</View>
				</TouchableOpacity>


				<Modal visible={this.state.modalVisible}
					ref='editModal'
					transparent={true}
					onRequestClose={() => this.setState({modalVisible: false})}
					animationType={'none'}>
					<TouchableOpacity style={styles.modalView} 
						onPress={() => this.setState({modalVisible: false})}
						activeOpacity={1}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContent}>
								<TouchableOpacity style={styles.closeModal}
									onPress={() => this.setState({modalVisible: false})}>
									<Feather name="x"
										size={30}
										color={grayColor} />
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
									
									<MaterialCommunityIcons name={categoryIcon}
										size={80}
										color={grayColor} />
								</View>

								<View style={styles.modalDetailsView}>
									<Text style={styles.modalDetailsTitle}>Details</Text>
									{details}
								</View>
								
								<View style={styles.actionsModal}>
									<TouchableOpacity style={styles.actionIconModal}
										onPress={() => this.navigateAndCloseModal(editScreen)}>
										<MaterialCommunityIcons name="square-edit-outline"
											size={40}
											color={grayColor} />
									</TouchableOpacity>

									<TouchableOpacity style={styles.actionIconModal}
										onPress={() => this.setState({modalVisible: false, edited: true, deleteDialogVisible: true})}>
										<MaterialCommunityIcons name="trash-can-outline"
											size={40}
											color={grayColor} />
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</TouchableOpacity>
				</Modal>

				<Modal visible={this.state.deleteDialogVisible}
					transparent={true}
					onRequestClose={() => {
						//do nothing;
					}}
					animationType={'none'}>
					<TouchableOpacity style={styles.modalView} 
						onPress={() => this.setState({deleteDialogVisible: false, edited: false})}
						activeOpacity={1}>
						<TouchableWithoutFeedback>
							<View style={styles.deleteDialogContent}>
								<View style={styles.deleteDialogMainRow}>
									<MaterialCommunityIcons name="trash-can-outline"
										size={80}
										color={grayColor} />

									<View style={styles.deleteDialogRightCol}>
										<Text style={styles.deleteDialogQuestion}>Delete this event?</Text>

										<View style={styles.deleteDialogOptions}>
											<TouchableOpacity onPress={() => this.setState({deleteDialogVisible: false, edited: false, modalVisible: this.state.edited})}>
												<Text style={styles.deleteDialogCancel}>Cancel</Text>
											</TouchableOpacity>

											<TouchableOpacity onPress={this.deleteEvent}>
												<Text style={styles.deleteDialogYes}>Yes</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</TouchableOpacity>
				</Modal>
			</View>
		);
	}
}

export default EventOverview;