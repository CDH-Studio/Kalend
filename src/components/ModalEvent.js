import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setNavigationScreen } from '../actions';
import { store } from '../store';
import { eventOverviewStyles as styles, gray } from '../styles';
import { calendarColors } from '../../config/config';


class ModalEvent extends React.PureComponent {

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
		return(
			<View>
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
											<Text style={[styles.modalTitle, {backgroundColor: this.props.categoryColor}]}>{this.props.eventTitle}</Text>
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
									
									<MaterialCommunityIcons name={this.props.categoryIcon}
										size={80}
										color={gray} />
								</View>

								<View style={styles.modalDetailsView}>
									<Text style={styles.modalDetailsTitle}>Details</Text>

									<View style={{height:this.props.detailHeight}} onStartShouldSetResponder={() => true}>
										<ScrollView>
											<TouchableOpacity activeOpacity={1}>
												{this.props.details}
											</TouchableOpacity>
										</ScrollView>
									</View>
								</View>
								
								<View style={styles.actionsModal}>
									<View style={styles.actionIconModal}>
										<IconButton
											size={40}
											onPress={() => this.navigateAndCloseModal(this.props.editScreen)}
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

export default connect(mapStateToProps, null)(ModalEvent);