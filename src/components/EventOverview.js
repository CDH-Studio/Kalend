import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setNavigationScreen } from '../actions';
import { store } from '../store';
import { eventOverviewStyles as styles, gray } from '../styles';
import { calendarColors } from '../../config';


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
			edited: false
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
		let detailHeight;

		if (this.props.category === 'SchoolSchedule') {
			categoryColor = this.props.courseColor;
			categoryIcon = 'school';
			details = 
				<View style={styles.modalDetailView}>
					<Text style={styles.modalDetailsSubtitle}>Location: </Text>
					<Text style={styles.modalDetailsText}>{this.props.location}</Text>
				</View>;
			detailHeight = 45;
			editScreen = 'Course';
		} else if (this.props.category === 'FixedEvent') {
			categoryColor = this.props.fixedEventsColor;
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
			detailHeight = 80;
			editScreen = 'FixedEvent';
		} else {
			categoryColor = this.props.nonFixedEventsColor;
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
			detailHeight = 100;
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
						<IconButton 
							size={30}
							style={{marginRight: 0}}
							onPress={() => {
								this.props.navigateEditScreen(editScreen);
									
								store.dispatch(setNavigationScreen({
									... store.getState().NavigationReducer,
									reviewEventSelected: this.props.id
								}));
							}}
							color={gray}
							icon={({ size, color }) => (
								<MaterialCommunityIcons
									name='square-edit-outline'
									size={size}
									color={color}
								/>
							)} />
						<IconButton 
							size={30}
							onPress={() => this.setState({deleteDialogVisible: true})}
							color={gray}
							icon={({ size, color }) => (
								<MaterialCommunityIcons
									name='trash-can-outline'
									size={size}
									color={color}
								/>
							)} />
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
										color={gray} />
								</TouchableOpacity>

								<View style={{height:70}}>
									<ScrollView>
										<TouchableOpacity activeOpacity={1}>
											<Text style={[styles.modalTitle, {backgroundColor: categoryColor}]}>{this.props.eventTitle}</Text>
										</TouchableOpacity>
									</ScrollView>
								</View>
								
								
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
										color={gray} />
								</View>

								<View style={styles.modalDetailsView}>
									<Text style={styles.modalDetailsTitle}>Details</Text>

									<View style={{height:detailHeight}} onStartShouldSetResponder={() => true}>
										<ScrollView>
											<TouchableOpacity activeOpacity={1}>
												{details}
											</TouchableOpacity>
										</ScrollView>
									</View>
								</View>
								
								<View style={styles.actionsModal}>
									<View style={styles.actionIconModal}>
										<IconButton
											size={40}
											onPress={() => this.navigateAndCloseModal(editScreen)}
											color={gray}
											icon={({ size, color }) => (
												<MaterialCommunityIcons
													name='square-edit-outline'
													size={size}
													color={color}
													style={{height: size, width: size}}
												/>
											)} />
									</View>
									<View style={styles.actionIconModal}>
										<IconButton
											size={40}
											onPress={() => this.setState({modalVisible: false, edited: true, deleteDialogVisible: true})}
											color={gray}
											icon={({ size, color }) => (
												<MaterialCommunityIcons
													name='trash-can-outline'
													size={size}
													color={color}
													style={{height: size, width: size}}
												/>
											)} />
									</View>
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
										color={gray} />

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

let mapStateToProps = (state) => {
	let { fixedEventsColor, nonFixedEventsColor, courseColor } = state.CalendarReducer;

	fixedEventsColor = calendarColors.map(i => {
		if (Object.keys(i)[0] === fixedEventsColor) {
			return Object.values(i)[0];
		}
	});

	nonFixedEventsColor = calendarColors.map(i => {
		if (Object.keys(i)[0] === nonFixedEventsColor) {
			return Object.values(i)[0];
		}
	});

	courseColor = calendarColors.map(i => {
		if (Object.keys(i)[0] === courseColor) {
			return Object.values(i)[0];
		}
	});

	return {
		fixedEventsColor,
		nonFixedEventsColor,
		courseColor
	};
};

export default connect(mapStateToProps, null)(EventOverview);