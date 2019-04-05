import React from 'react';
import { View, Text, StatusBar, Platform, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableRipple } from 'react-native-paper';
import { calendarPermissionStyles as styles, gray, dark_blue, blue } from '../../styles';

/**
 * 
 */
class CalendarPermission extends React.PureComponent {
	static navigationOptions = {
		title: 'Calendar Permissions'
	}

	constructor(props) {
		super(props);

		this.state = {
			data: []
		};
	}

	/**
	 * The callback function when the CalendarItem is touched
	 */
	_onPressItem = (id) => {
		this.setState((state) => {
			const selected = new Map(state.selected);
			selected.set(id, !selected.get(id));
			return {selected};
		});
	};
	
	/**
	 * The render function for the items in the flatList
	 */
	_renderItem = ({item, index}) => {
		return (
			<CalendarPermissionItem id={index}
				onPressItem={this._onPressItem}
				selected={!!this.state.selected.get(index)}
				name={item.id} />
		);
	};

	render() {
		const { data } = this.state;

		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

				<Text style={styles.title}>
					Modify who can see your calendar
				</Text>

				<View style={styles.list}>
					<FlatList data={data}
						renderItem={this._renderItem}
						keyExtractor={(item, index) => index.toString()}
						style={styles.flatList} 
						scrollEnabled={data.legnth !== 0}
						ListEmptyComponent={() => (
							<TouchableOpacity onPress={this.refreshData}>
								<View style={styles.emptyContainer}>
									<MaterialCommunityIcons size={50}
										name='calendar-search'
										color={gray}/>
									<Text style={styles.emptyTitle}>No calendars found</Text> 
									<Text style={styles.emptyDescription}>Tap to refresh the calendar info</Text> 
								</View>
							</TouchableOpacity>
						)}
						refreshControl={
							<RefreshControl
								refreshing={this.state.loadingSharedList}
								onRefresh={this.refreshData}
								tintColor={gray}
								colors={[dark_blue, blue]} />
						} />
				</View>

				<View style={styles.buttons}>

				</View>
			</View>
		);
	}
}

export default CalendarPermission;