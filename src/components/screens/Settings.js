import React from 'react';
import { StatusBar, View , TouchableOpacity, Text, Platform, Image, ScrollView, Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-navigation';
import { LoginNavigator, UnavailableRoute, SchoolInformationRoute, CleanReducersRoute, CalendarPermissionRoute } from '../../constants/screenNames';
import { settingsStyles as styles, blue, statusBarDark, statusBarPopover } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { googleSignOut } from '../../services/google_identity';
import { clearEveryReducer, getStrings } from '../../services/helper';
import EventsColorPicker from '../EventsColorPicker';
import ImportCalendar from '../ImportCalendar';
import LanguageSwitcher from '../LanguageSwitcher';

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
			showImportCalendar: false,
			languageDialogVisible: false
		};

		// Updates the navigation location in redux
		updateNavigation('Settings', props.navigation.state.routeName);
	}

	dismissEventsColorPicker = () => {
		this.setState({showEventsColorPicker: false});
		this.restoreStatusBar();
	}

	dismissImportCalendar = () => {
		this.setState({showImportCalendar: false});
		this.restoreStatusBar();
	}

	dismissLanguage = () => {
		this.setState({languageDialogVisible: false});
		this.restoreStatusBar();
	}

	showEventsColorPicker = () => {
		this.setState({showEventsColorPicker: true});
		this.darkenStatusBar();
	}

	showImportCalendar = () => {
		this.setState({showImportCalendar: true});
		this.darkenStatusBar();
	}

	showLanguage = () => {
		this.setState({languageDialogVisible: true});
		this.darkenStatusBar();
	}

	darkenStatusBar = () => {
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor(statusBarPopover, true);
		}
	}

	restoreStatusBar = () => {
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor(statusBarDark, true);
		}
	}

	render() {
		const { containerHeight, showEventsColorPicker, showImportCalendar, languageDialogVisible } = this.state;

		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					animated
					barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
					backgroundColor={statusBarDark} />
				
				<EventsColorPicker visible={showEventsColorPicker}
					dismiss={this.dismissEventsColorPicker} />

				<ImportCalendar visible={showImportCalendar}
					dismiss={this.dismissImportCalendar} />

				<LanguageSwitcher visible={languageDialogVisible}
					dismiss={this.dismissLanguage} />

				<ScrollView>
					<View style={[styles.content, {height: containerHeight}]}>
						<View style={styles.topProfileContainer}>
							<View style={styles.profileIconContainer}>
								<Image style={styles.profileImage}
									source={{uri: this.props.profileImage}} />
							</View>

							<Text style={styles.profileDescription}>
								{this.props.userName}
							</Text>
						</View>
						
						{
							__DEV__ ?
								<View style={styles.titleRow}> 
									<IconButton icon="delete"
										onPress={() => this.props.navigation.navigate(CleanReducersRoute)}
										size={20}
										color={blue}/> 
								</View>: null
						}

						<View style={styles.titleRow}>
							<MaterialIcons name="person-outline"
								size={30}
								color={blue} />
								
							<Text style={styles.title}>{this.strings.profile}</Text>
						</View>

						<TouchableOpacity style={styles.button}
							onPress={this.showImportCalendar}>
							<Text style={styles.buttonText}>Import Calendar</Text>
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
							onPress={this.showLanguage}>
							<Text style={styles.buttonText}>{this.props.language === 'en' ? 'Français' : 'English'}</Text>
						</TouchableOpacity>
						
						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.notifications}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => this.props.navigation.navigate(CalendarPermissionRoute)}>
							<Text style={styles.buttonText}>Modify who can see your calendar</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={this.showEventsColorPicker}>
							<Text style={styles.buttonText}>{this.strings.theme}</Text>
						</TouchableOpacity>

						<View style={styles.titleRow}>
							<MaterialCommunityIcons name="cellphone-settings-variant"
								size={30}
								color={blue} />

							<Text style={styles.title}>{this.strings.general}</Text>
						</View>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.help}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.tutorial}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.deleteCalendar}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.clearCache}</Text>
						</TouchableOpacity>
						
						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.privacyPolicy}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={ ()=>{
							Linking.openURL('https://cdhstudio.ca/' + this.props.language === 'en' ? '' : 'fr');
						}}>
							<Text style={styles.buttonText}>{this.strings.cdhStudio}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								googleSignOut();
								clearEveryReducer();
								this.props.navigation.navigate(LoginNavigator);
							}}>
							<Text style={styles.buttonLogOutText}>{this.strings.logout}</Text>
						</TouchableOpacity>

						<Text style={styles.version}>{this.strings.version}</Text>
					</View>
				</ScrollView>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { HomeReducer, SettingsReducer } = state;

	let hasUserInfo = HomeReducer.profile != null;

	return {
		profileImage: hasUserInfo ? HomeReducer.profile.profile.user.photo : `https://api.adorable.io/avatars/285/${new Date().getTime()}.png`,
		userName: hasUserInfo ? HomeReducer.profile.profile.user.name : 'Unkown user',
		language: SettingsReducer.language
	};
};

export default connect(mapStateToProps, null)(Settings);
