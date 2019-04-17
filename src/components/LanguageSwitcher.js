import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RNRestart from 'react-native-restart';
import Modal from 'react-native-modal';
import { setLanguage } from '../actions';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { languageSwitcherStyles as styles, dark_blue } from '../styles';
import { getStrings, deviceHeight, deviceWidth } from '../services/helper';

class LanguageSwitcher extends React.PureComponent {

	strings = getStrings().Settings;

	constructor(props) {
		super(props);

		this.state = {
			visible: props.visible
		};
	}

	/**
	 * Gets the new value of visible and updates it in the props
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			visible: newProps.visible,
		});
	}

	/**
	 * Dismisses the modal
	 */
	removeModal = () => {
		this.setState({ visible: false });
		this.props.dismiss();
	}

	render() {
		const { visible } = this.state;

		return(
			<View style={styles.container}>
				<Modal isVisible={visible}
					deviceHeight={deviceHeight}
					deviceWidth={deviceWidth}
					onBackdropPress={this.removeModal}
					useNativeDriver>
					<View style={styles.modalContent}>
						<View style={styles.languageDialogMainRow}>
							<MaterialIcons name="language"
								size={60}
								color={dark_blue} />

							<View style={styles.languageDialogRightCol}>
								<Text style={styles.languageDialogQuestion}>{this.strings.changeLanguage}</Text>

								<View style={styles.languageDialogOptions}>
									<TouchableOpacity onPress={this.removeModal}>
										<Text style={styles.languageDialogCancel}>{this.strings.cancel}</Text>
									</TouchableOpacity>

									<TouchableOpacity onPress={() => {
										this.props.dispatch(setLanguage(this.props.language === 'en' ? 'fr' : 'en'));

										this.removeModal();

										setTimeout(() => {
											RNRestart.Restart();
										}, 50);
									}}>
										<Text style={styles.languageDialogYes}>{this.strings.yes}</Text>
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

export default connect()(LanguageSwitcher);