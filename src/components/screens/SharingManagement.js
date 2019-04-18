import React from 'react';
import { View, Platform, StatusBar, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { sharingManagementStyles as styles, white, gray, dark_blue } from '../../styles';
import { Snackbar } from 'react-native-paper';
import { getStrings } from '../../services/helper';
import SharingManagementItem from '../SharingManagementItem';
import { requestCalendarPermissions } from '../../services/firebase_messaging';

class SharingManagement extends React.PureComponent {
	strings = getStrings().SharingManagement;

	static navigationOptions = ({ navigation }) => {
		return {
			title: navigation.state.params.title,
			headerStyle: {
				backgroundColor: white,
			}
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			loadingList: false,
			snackbarVisible: false,
			snackbarTime: 3000,
			snackbarText: '',
		};
	}

	componentWillMount() {
		this.getData();
	}

	getData = () => {
		this.setState({loadingList: true});
		firebase.database()
			.ref(`notifications/${this.props.id}/`)
			.once('value', 
				async (data) => {
					data = await data.val();

					let notDimissed = [];
					if (data) {
						Object.keys(data).map(i => {
							if (!('dismiss' in data[i]) || data[i].dismiss) {
								notDimissed.push({
									...data[i],
									notificationPath: i
								});
							}
						});
					}

					this.setState({
						loadingList: false,
						data: notDimissed
					});
				});
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

	_deleteItem = (id) => {
		let data = this.state.data.slice();
		data.splice(id, 1);
		this.setState({
			data
		});
	}

	_onAllowItem = (id) => {
		requestCalendarPermissions({
			requester: {email: this.state.data[id].email},
			accepter: {email: this.props.email}
		})
			.then(res => res.json())
			.then(success => {
				if (success) {
					this._deleteItem(id);
					firebase.database()
						.ref(`notifications/${this.props.id}/${this.state.data[id].notificationPath}/`)
						.update({
							allow: true,
							dismiss: false
						});
					this.setState({
						snackbarVisible: true,
						snackbarText: this.strings.allowSuccess,
					});
				} else {
					this.setState({
						snackbarVisible: true,
						snackbarText: this.strings.allowError,
					});
				}
			});
	}

	_onDenyItem = (id) => {
		this._deleteItem(id);
		firebase.database()
			.ref(`notifications/${this.props.id}/${this.state.data[id].notificationPath}/`)
			.update({
				allow: false,
				dismiss: false
			});

		this.setState({
			snackbarVisible: true,
			snackbarText: this.strings.denySuccess,
		});
	}
	
	/**
	 * The render function for the items in the flatList
	 */
	_renderItem = ({item, index}) => {
		return (
			<SharingManagementItem id={index}
				total={this.state.data.length}
				title={item.name}
				denyItem={this._onDenyItem}
				allowItem={this._onAllowItem}
				subtitle={item.email == undefined ? '' : item.email} />
		);
	};

	render() {
		const { data, loadingList, snackbarText, snackbarTime, snackbarVisible } = this.state;

		return (
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

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
									<TouchableOpacity onPress={this.getData}>
										<View style={styles.emptyContainer}>
											<MaterialIcons size={70}
												name='notifications-paused'
												color={gray}/>
											<Text style={styles.emptyTitle}>{this.strings.emptyTitle}</Text> 
											<Text style={styles.emptyDescription}>{this.strings.emptyDescription}</Text> 
										</View>
									</TouchableOpacity>
								)}
								refreshControl={
									<RefreshControl
										refreshing={loadingList}
										onRefresh={this.getData}
										tintColor={gray}
										colors={[dark_blue]} />
								} />
					}
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

let mapStateToProps = (state) => {
	const { id, email } = state.HomeReducer.profile.profile.user;
	return {
		id, email
	};
};

export default connect(mapStateToProps)(SharingManagement);