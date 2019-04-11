import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { eventOverviewStyles as styles, white } from '../styles';
import { calendarColors } from '../../config/config';
import DeleteModal from './DeleteModal';


class ModalEvent extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false
		};
	}

	componentWillReceiveProps(newProp) {
		this.setState({modalVisible: newProp.visible});
	}

	/**
	 * In order for the info modal to not stay open when on edit screen 
	 */
	navigateAndCloseModal = (editScreen) => {
		this.props.dismiss();
		this.props.navigateEditScreen(editScreen);
	}

	dismissModal = () => {
		this.setState({modalVisible: false});
		this.props.dismiss();
	}

	render() {
		let semiTransparentWhite = '#ffffffa0';

		return(
			<View>
				<Modal isVisible={this.state.modalVisible}
					onBackdropPress={this.dismissModal}
					useNativeDriver>
					<View style={[styles.modalContent, {backgroundColor: this.props.categoryColor}]}>
						<TouchableOpacity style={styles.closeModal}
							onPress={this.dismissModal}>
							<Feather name="x"
								size={30}
								color={semiTransparentWhite} />
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
									<Text style={[styles.modalInfoText, {color: semiTransparentWhite}]}>{this.props.date}</Text>
								</View>
								<View style={styles.modalInfoTime}>
									<Text style={styles.modalInfoTitle}>Time: </Text>
									<Text style={[styles.modalInfoText, {color: semiTransparentWhite}]}>{this.props.time}</Text>
								</View>
							</View>
							
							<MaterialCommunityIcons name={this.props.categoryIcon}
								size={80}
								color={semiTransparentWhite} />
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
						
						<View style={[styles.actionsModal, {backgroundColor: this.props.categoryColor}]}>
							<View style={styles.actionIconModal}>
								<IconButton
									size={40}
									onPress={() => this.navigateAndCloseModal(this.props.editScreen)}
									color={white}
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
									onPress={() => {
										this.dismissModal();
										this.props.showDeleteModal(true);
									}}
									color={white}
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
				</Modal>

				<DeleteModal />
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