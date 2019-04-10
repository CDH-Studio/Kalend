import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { eventOverviewStyles as styles, gray } from '../styles';


class DeleteModal extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			deleteDialogVisible: false,
			shouldShowModal: false
		};
	}

	componentWillReceiveProps(newProp) {
		this.setState({deleteDialogVisible: newProp.visible, shouldShowModal:newProp.shouldShowModal});
	}

	/**
	 * To delete the event from the database and delete the component 
	 */
	deleteEvent = () => {
		this.setState({deleteDialogVisible: false, shouldShowModal: false});
		this.props.dismiss();
		this.props.deleteEvent();
	}

	dismissDelete = () => {
		this.setState({deleteDialogVisible: false});
		this.props.dismiss();
	}

	render() {
		return(
			<View>
				<Modal visible={this.state.deleteDialogVisible}
					transparent={true}
					onRequestClose={() => {
						//do nothing;
					}}
					animationType={'none'}>
					<TouchableOpacity style={styles.modalView} 
						onPress={() => this.setState({deleteDialogVisible: false, shouldShowModal: false})}
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
											<TouchableOpacity onPress={() => {
												if (this.state.shouldShowModal) {
													this.props.showModal();
												} else {
													this.dismissDelete();
												}

												this.setState({deleteDialogVisible: false, shouldShowModal: false});
											}}>
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

export default connect()(DeleteModal);