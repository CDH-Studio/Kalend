import React from 'react';
import { View, Text } from 'react-native';
import { sharingManagementItemsStyles as styles, whiteRipple, blueRipple } from '../styles';
import { TouchableRipple } from 'react-native-paper';
import { getStrings } from '../services/helper';

class SharingManagementItem extends React.PureComponent {
	strings = getStrings().SharingManagementItem;

	deny = () => {
		this.props.denyItem(this.props.id);
	}

	allow = () => {
		this.props.allowItem(this.props.id);
	}

	render() {
		const { title, subtitle, id, total} = this.props;

		return (
			<View style={[styles.content, {marginTop: id === 0 ? 15 : 5, marginBottom: total - 1 === id ? 15 : 5}]}>
				<View>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.email}>{subtitle}</Text>
				</View>
				<View style={styles.buttons}>
					<TouchableRipple style={styles.deny}
						onPress={this.deny}
						rippleColor={whiteRipple}
						underlayColor={whiteRipple}>
						<Text style={styles.denyText}>{this.strings.deny}</Text>
					</TouchableRipple>
					<TouchableRipple style={styles.allow}
						onPress={this.allow}
						rippleColor={whiteRipple}
						underlayColor={blueRipple}>
						<Text style={styles.allowText}>{this.strings.allow}</Text>
					</TouchableRipple>
				</View>
			</View>
		);
	}
}

export default SharingManagementItem;