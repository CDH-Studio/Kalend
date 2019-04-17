import React from 'react';
import { View, Text, StatusBar, Platform, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableRipple, Snackbar } from 'react-native-paper';
import { calendarPermissionStyles as styles, gray, dark_blue, whiteRipple, blueRipple } from '../../styles';
import { getStrings } from './../../services/helper';
import { listPermissions, removePermissionPerson } from '../../services/service';
import CalendarPermissionItem from '../CalendarPermissionItem';

/**
 * Shows the users for which you have a calendar access
 */
class CalendarPermission extends React.PureComponent {

	strings = getStrings().CalendarPermission;

	static navigationOptions = ({ navigation }) => {
		return	{
			title: navigation.state.params.title
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			selected: (new Map()),
			loadingList: false,
			snackbarVisible: false,
			snackbarTime: 3000,
			snackbarText: '',
		};
	}

	componentWillMount() {
		this.refreshData();
	}

	/**
	 * Reloads data from the flatList
	 */
	refreshData = () => {
		this.setState({loadingList: true});
		setTimeout(() => {
			listPermissions().then((data) => {
				this.setState({
					data,
					loadingList: false
				});
			});
		}, 500);
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
				name={item.email} />
		);
	};

	/**
	 * Returns a list of calendarIds that are selected from the flatList
	 */
	getListIdSelected = () => {
		let selectedValue = [];

		for (const entry of this.state.selected.entries()) {
			if (entry[1]) {
				selectedValue.push(this.state.data[entry[0]].id);
			}
		}

		return selectedValue;
	}

	/**
	 * Delete the calendarIds from the flatList
	 */
	delete = () => {
		let calendarIds = this.getListIdSelected();
		let error = false;

		calendarIds.map(id => {
			removePermissionPerson(id)
				.catch((err) => {
					this.setState({
						snackbarText: err,
						snackbarVisible: true
					});
					error = true;
				});
		});

		if (calendarIds.length !== 0) {
			if (!error) {
				this.setState({
					snackbarText: this.strings.deleteSuccess,
					snackbarVisible: true
				});
			}
	
			this.refreshData();
		}
	}

	render() {
		const { data, loadingList, snackbarText, snackbarTime, snackbarVisible } = this.state;

		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

				<Text style={styles.title}>{this.strings.mainTitle}</Text>

				<View style={styles.list}>
					{ 
						loadingList ? 
							<View style={styles.activityIndicatorContainer}>
								<ActivityIndicator animating={loadingList} 
									size="large" 
									color={gray} />
							</View> :
							<FlatList data={data}
								renderItem={this._renderItem}
								keyExtractor={(item, index) => index.toString()}
								style={styles.flatList} 
								scrollEnabled={data.length !== 0}
								ListEmptyComponent={() => (
									<TouchableOpacity onPress={this.refreshData}>
										<View style={styles.emptyContainer}>
											<MaterialCommunityIcons size={50}
												name='account-search'
												color={gray}/>

											<Text style={styles.emptyTitle}>{this.strings.emptyTitle}</Text> 
											
											<Text style={styles.emptyDescription}>{this.strings.emptyDescription}</Text> 
										</View>
									</TouchableOpacity>
								)}
								refreshControl={
									<RefreshControl
										refreshing={loadingList}
										onRefresh={this.refreshData}
										tintColor={gray}
										colors={[dark_blue]} />
								} />
					}
				</View>

				<View style={styles.buttons}>
					<TouchableRipple style={styles.availabilityButton}
						rippleColor={whiteRipple}
						underlayColor={blueRipple}
						onPress={this.delete}>
						<Text style={styles.availabilityButtonText}>{this.strings.delete}</Text>
					</TouchableRipple>
				</View>

				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => this.setState({ snackbarVisible: false })} 
					style={styles.snackbar}
					duration={snackbarTime}>
					{snackbarText}
				</Snackbar>
			</View>
		);
	}
}

export default CalendarPermission;