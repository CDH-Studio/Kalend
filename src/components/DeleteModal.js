import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStrings, deviceHeight, deviceWidth } from '../services/helper';
import { deleteModalStyles as styles, dark_blue } from '../styles';


class DeleteModal extends React.PureComponent {

	strings = getStrings().DeleteModal;

	constructor(props) {
		super(props);

		this.state = {
			deleteDialogVisible: false,
			shouldShowModal: false
		};
	}

	componentWillReceiveProps(newProp) {
		this.setState({deleteDialogVisible: newProp.visible, shouldShowModal: newProp.shouldShowModal});
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
		this.setState({deleteDialogVisible: false, shouldShowModal: this.props.shouldShowModal});
		this.props.dismiss();
	}

	render() {
		return(
			<View>
				<Modal isVisible={this.state.deleteDialogVisible}
					deviceHeight={deviceHeight}
					deviceWidth={deviceWidth}
					onBackdropPress={this.dismissDelete}
					useNativeDriver
					onModalHide={() => {
						if (this.props.shouldShowModal) {
							this.props.showModal();
						}
					}}>
					<View style={styles.modalContent}>
						<View style={styles.dialogMainRow}>
							<MaterialCommunityIcons name="trash-can-outline"
								size={60}
								color={dark_blue}
								style={styles.icon} />

							<View style={styles.dialogRightCol}>
								<Text style={styles.dialogQuestion}>{this.strings.deleteEvent}</Text>

								<View style={styles.dialogOptions}>
									<TouchableOpacity onPress={() => {
										if (
											!this.state.shouldShowModal) {
											this.dismissDelete();
										}

										this.dismissDelete();
									}}>
										<Text style={styles.dialogCancel}>{this.strings.cancel}</Text>
									</TouchableOpacity>

									<TouchableOpacity onPress={this.deleteEvent}>
										<Text style={styles.dialogYes}>{this.strings.yes}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export default connect()(DeleteModal);