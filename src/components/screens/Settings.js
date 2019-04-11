import React from 'react';
import { StatusBar, View , TouchableOpacity, Text, Platform, Image, ScrollView, Dimensions, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNRestart from 'react-native-restart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomTabs } from 'react-native-custom-tabs';
import { Header } from 'react-navigation';
import { LoginNavigator, UnavailableRoute, SchoolInformationRoute, CleanReducersRoute, CalendarPermissionRoute } from '../../constants/screenNames';
import { settingsStyles as styles, blue, dark_blue, gray, statusBarDark } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { deleteCalendar, createSecondaryCalendar } from '../../services/google_calendar';
import { googleSignOut } from '../../services/google_identity';
import { clearEveryReducer, getStrings } from '../../services/helper';
import { setLanguage, setCalendarID } from '../../actions';
import EventsColorPicker from '../EventsColorPicker';
import ImportCalendar from '../ImportCalendar';

import SafariView from 'react-native-safari-view';

const viewHeight = 669.1428833007812;

class Settings extends React.PureComponent {

	static navigationOptions = {
		header: null
	}
	
	strings = getStrings().Settings;

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		this.state = {
			containerHeight, 
			showEventsColorPicker: false,
			snackbarVisible: false,
			snackbarText: '',
			snackbarTime: 3000,
			languageDialogVisible: false,
			showImportCalendar: false,
		};

		// Updates the navigation location in redux
		updateNavigation('Settings', props.navigation.state.routeName);
	}

	dismissEventsColorPicker = () => {
		this.setState({showEventsColorPicker: false});
	}

	showWebsite = (url) => {
		if (Platform.OS === 'ios') {
			this.openSafari(url);
		} else {
			this.openChrome(url);
		}
	}

	openSafari = (url) => {
		SafariView.isAvailable()
			.then(SafariView.show({url,
				tintColor: dark_blue,
				barTintColor: '#fff',
				fromBottom: true }))
			.catch(() => this.openChrome(url));
	}

	openChrome = (url) => {
		CustomTabs.openURL(url, {
			toolbarColor: dark_blue,
			enableUrlBarHiding: true,
			showPageTitle: true,
			enableDefaultShare: true,
			forceCloseOnRedirection: true,
		});
	}

	logout = () => {
		googleSignOut();
		clearEveryReducer();
		this.props.navigation.navigate(LoginNavigator);
	}

	dismissImportCalendar = () => {
		this.setState({showImportCalendar: false});
	}

	render() {
		const { containerHeight, showEventsColorPicker, showImportCalendar, snackbarText, snackbarTime, snackbarVisible } = this.state;

		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBarDark} />
				
				<EventsColorPicker visible={showEventsColorPicker}
					dismiss={() => this.dismissEventsColorPicker()}/>

				<ImportCalendar visible={showImportCalendar}
					dismiss={() => this.dismissImportCalendar()}/>

				<ScrollView>
					<View style={[styles.content, {height: containerHeight}]}>
						<View style={styles.topProfileContainer}>
							<View style={styles.profileIconContainer}>
								<Image style={styles.profileImage}
									source={{uri: this.props.profileImage}}/>
							</View>

							<Text style={styles.profileDescription}
								onPress={() => {
									if (__DEV__) this.props.navigation.navigate(CleanReducersRoute);
								}} >
								{this.props.userName}
							</Text>
						</View>

						<View style={styles.titleRow}>
							<MaterialIcons name="person-outline"
								size={30}
								color={blue} />
								
							<Text style={styles.title}>{this.strings.profile}</Text>
						</View>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								this.setState({showImportCalendar: true});
							}}>
							<Text style={styles.buttonText}>{this.strings.import}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								this.props.navigation.navigate(UnavailableRoute, {title: getStrings().UnavailableHours.title});
							}}>
							<Text style={styles.buttonText}>{this.strings.unavailableHours}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								this.props.navigation.navigate(SchoolInformationRoute, {title: getStrings().SchoolInformation.title});
							}}>
							<Text style={styles.buttonText}>{this.strings.schoolInformation}</Text>
						</TouchableOpacity>

						<View style={styles.titleRow}>
							<MaterialCommunityIcons name="account-heart-outline"
								size={30}
								color={blue} />

							<Text style={styles.title}>{this.strings.preferences}</Text>
						</View>

						<TouchableOpacity style={styles.button}
							onPress={() => this.setState({languageDialogVisible: true})}>
							<Text style={styles.buttonText}>{this.strings.languageTitle}</Text>
						</TouchableOpacity>

						<Modal visible={this.state.languageDialogVisible}
							transparent={true}
							onRequestClose={() => {
								//do nothing;
							}}
							animationType={'none'}>
							<TouchableOpacity style={styles.modalView} 
								onPress={() => this.setState({languageDialogVisible: false})}
								activeOpacity={1}>
								<TouchableWithoutFeedback>
									<View style={styles.languageDialogContent}>
										<View style={styles.languageDialogMainRow}>
											<MaterialIcons name="language"
												size={80}
												color={gray} />

											<View style={styles.languagerDialogRightCol}>
												<Text style={styles.languageDialogQuestion}>{this.strings.changeLanguage}</Text>

												<View style={styles.languageDialogOptions}>
													<TouchableOpacity onPress={() => this.setState({languageDialogVisible: false})}>
														<Text style={styles.languageDialogCancel}>{this.strings.cancel}</Text>
													</TouchableOpacity>

													<TouchableOpacity onPress={() => {
														this.props.dispatch(setLanguage(this.props.language === 'en' ? 'fr' : 'en'));

														this.setState({languageDialogVisible: false});

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
								</TouchableWithoutFeedback>
							</TouchableOpacity>
						</Modal>

						{/* <TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.notifications}</Text>
						</TouchableOpacity> */}

						<TouchableOpacity style={styles.button}
							onPress={() => this.props.navigation.navigate(CalendarPermissionRoute, {title: getStrings().CalendarPermission.title})}>
							<Text style={styles.buttonText}>{this.strings.modifySharing}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => this.setState({showEventsColorPicker: true})}>
							<Text style={styles.buttonText}>{this.strings.theme}</Text>
						</TouchableOpacity>

						<View style={styles.titleRow}>
							<MaterialCommunityIcons name="cellphone-settings-variant"
								size={30}
								color={blue} />

							<Text style={styles.title}>{this.strings.general}</Text>
						</View>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								this.showWebsite('https://github.com/CDH-Studio/Kalend/wiki/FAQ');
							}}>
							<Text style={styles.buttonText}>{this.strings.help}</Text>
						</TouchableOpacity>

						{/* <TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.tutorial}</Text>
						</TouchableOpacity> */}

						<TouchableOpacity style={styles.button}
							onPress={() => {
								Alert.alert(
									this.strings.modifyCalendar,
									this.strings.modifyCalendarDescription,
									[
										{text: this.strings.cancel, style: 'cancel'},
										{text: this.strings.deleteCalendar, onPress: () => {
											Alert.alert(
												this.strings.warning,
												this.strings.warningDescription,
												[
													{text: this.strings.cancel, style: 'cancel'},
													{text: this.strings.ok, onPress: async () => {
														await deleteCalendar(this.props.calendarId);
														this.logout();
													}},
												],
												{cancelable: false}
											);
										}},
										{text: this.strings.clearCalendar, onPress: async () => {
											this.setState({
												snackbarVisible: true,
												snackbarTime: 4000,
												snackbarText: this.strings.clearing,
											});
											let deleteData = await deleteCalendar(this.props.calendarId);
											let createData = await createSecondaryCalendar({summary: 'Kalend'});

											if ('error' in deleteData || 'error' in createData) {
												this.setState({
													snackbarVisible: true,
													snackbarTime: 3000,
													snackbarText: this.strings.clearingError,
												});
											} else {
												this.props.dispatch(setCalendarID(createData.id));
												this.setState({
													snackbarVisible: true,
													snackbarTime: 3000,
													snackbarText: this.strings.deleteCalendarSuccess,
												});
											}
										}},
									],
									{cancelable: true}
								);
							}}>
							<Text style={styles.buttonText}>{this.strings.clearDeleteCalendar}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} 
							onPress={()=>{
								this.showWebsite('https://cdhstudio.ca/');
							}}>
							<Text style={styles.buttonText}>{this.strings.cdhStudio}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} 
							onPress={() => {
								Alert.alert(
									this.strings.warning,
									this.strings.deleteDescription,
									[
										{text: this.strings.cancel, style: 'cancel'},
										{text: this.strings.ok, onPress: async () => {
											await deleteCalendar(this.props.calendarId);
											this.logout();
										}},
									],
									{cancelable: false}
								);
							}}>
							<Text style={styles.buttonLogOutText}>{this.strings.deleteAccount}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={this.logout}>
							<Text style={styles.buttonLogOutText}>{this.strings.logout}</Text>
						</TouchableOpacity>

						<Text style={styles.version}>{this.strings.version}</Text>

						<View style={[styles.privacyContainer, {marginLeft: this.props.language === 'en' ? 15 : 0}]}>
							<TouchableOpacity style={styles.privacy}
								onPress={() => {
									this.showWebsite('https://github.com/CDH-Studio/Kalend/wiki/Privacy-Policy');
								}}>
								<Text style={styles.privacyText}>{this.strings.privacyPolicy}</Text>
							</TouchableOpacity>

							<Text style={styles.privacyText}>   |   </Text>

							<TouchableOpacity style={styles.privacy}
								onPress={() => {
									this.showWebsite('https://github.com/CDH-Studio/Kalend/wiki/Terms-of-Service');
								}}>
								<Text style={styles.privacyText}>{this.strings.termsOfService}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

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
	const { HomeReducer, CalendarReducer, SettingsReducer } = state;

	let hasUserInfo = HomeReducer.profile != null;

	return {
		profileImage: hasUserInfo ? HomeReducer.profile.profile.user.photo : `https://api.adorable.io/avatars/285/${new Date().getTime()}.png`,
		userName: hasUserInfo ? HomeReducer.profile.profile.user.name : 'Unkown user',
		calendarId: CalendarReducer.id,
		language: SettingsReducer.language
	};
};

export default connect(mapStateToProps, null)(Settings);
