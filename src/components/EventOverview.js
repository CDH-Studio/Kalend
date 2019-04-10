import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setNavigationScreen } from '../actions';
import ModalEvent from '../components/ModalEvent';
import { store } from '../store';
import { eventOverviewStyles as styles, gray } from '../styles';
import { calendarColors } from '../../config/config';
import DeleteModal from './DeleteModal';

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
			shouldShowModal: false
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
		this.setState({deleteDialogVisible: false, modalVisible: false, shouldShowModal: false});
		this.props.action(this.props.id, this.props.category);
	}

	showDeleteModal = (shouldShowModal) => {
		this.setState({deleteDialogVisible: true, shouldShowModal});
	}

	showModal = () => {
		this.setState({modalVisible: true});
	}

	dismissModal = () => {
		this.setState({modalVisible: false});
	}

	dismissDelete = () => {
		this.setState({deleteDialogVisible: false});
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
							onPress={() => this.showDeleteModal(false)}
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

				<ModalEvent visible={this.state.modalVisible}
					dismiss={this.dismissModal}
					navigateEditScreen={this.props.navigateEditScreen}
					categoryColor={categoryColor}
					eventTitle={this.props.eventTitle}
					date={this.props.date}
					time={this.props.time}
					categoryIcon={categoryIcon}
					detailHeight={detailHeight}
					details={details}
					editScreen={editScreen}
					showDeleteModal={this.showDeleteModal} />

				<DeleteModal visible={this.state.deleteDialogVisible}
					dismiss={this.dismissDelete}
					shouldShowModal={this.state.shouldShowModal}
					deleteEvent={this.deleteEvent}
					showModal={this.showModal} />
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	let { fixedEventsColor, nonFixedEventsColor, courseColor } = state.CalendarReducer;
	
	for (let i = 0; i < calendarColors.length; i++) {
		let key = Object.keys(calendarColors[i])[0];
		let value = Object.values(calendarColors[i])[0];

		switch(key) {
			case fixedEventsColor:
				fixedEventsColor = value;
				break;
			
			case nonFixedEventsColor:
				nonFixedEventsColor = value;
				break;
				
			case courseColor:
				courseColor = value;
				break;
		}
	}

	return {
		fixedEventsColor,
		nonFixedEventsColor,
		courseColor
	};
};

export default connect(mapStateToProps, null)(EventOverview);