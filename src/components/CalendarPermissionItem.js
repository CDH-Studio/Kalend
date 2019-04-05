import React from 'react';
import { View, Text, Image } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { calendarPermissionItemStyles as styles, dark_blue } from '../styles';

/**
 * The component populating the flatList
 * 
 * @prop {String} id The id of the item in the list
 * @prop {Boolean} selected The value of the checkbox
 * @prop {String} name The name of the person to be displayed next to the icon
 * @prop {String} photo	The photo from google account
 * @prop {Function} onPressItem the function to be triggered in the parent component when the item is touched
 */
class CalendarPermissionItem extends React.PureComponent {
	_onPress = () => {
		this.props.onPressItem(this.props.id);
	};
  
	render() {
		return (
			<View style={styles.calendarItem}>
				<Checkbox.Android status={this.props.selected ? 'checked' : 'unchecked'}
					onPress={this._onPress} 
					theme={{colors:{accent:dark_blue}}} />

				<TouchableOpacity onPress={this._onPress} style={styles.calendarItemTouch}>
					<View style={styles.calendarItemImageContainer}>
						<Image style={styles.calendarItemImage}
							source={{uri: this.props.photo == undefined ? 'https://api.adorable.io/avatars/' + this.props.name : this.props.photo}} />
					</View>

					<Text style={styles.calendarItemName}>
						{this.props.name}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default CalendarPermissionItem;