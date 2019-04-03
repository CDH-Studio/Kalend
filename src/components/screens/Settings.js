import React from 'react';
import { StatusBar, View , TouchableOpacity, Text, Platform, Image, ScrollView, Dimensions, Linking, Modal, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNRestart from 'react-native-restart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-navigation';
import { LoginNavigator, UnavailableRoute, SchoolInformationRoute, CleanReducersRoute } from '../../constants/screenNames';
import { settingsStyles as styles, blue, gray } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { googleSignOut } from '../../services/google_identity';
import { clearEveryReducer, getStrings } from '../../services/helper';
import { setLanguage } from '../../actions';
import EventsColorPicker from '../EventsColorPicker';

const viewHeight = 669.1428833007812;

class Settings extends React.PureComponent {

	strings = getStrings().Settings;

	static navigationOptions = ({navigation}) => ({
		headerRight: (__DEV__ ? <IconButton
			icon="delete"
			onPress={() => navigation.navigate(CleanReducersRoute)}
			size={20}
			color={blue}/> : null)
	});

	constructor(props) {
		super(props);

		let containerHeightTemp = Dimensions.get('window').height - Header.HEIGHT;
		let containerHeight = viewHeight < containerHeightTemp ? containerHeightTemp : null;

		this.state = {
			containerHeight,
			languageDialogVisible: false,
			showEventsColorPicker: false
		};

		// Updates the navigation location in redux
		updateNavigation('Settings', props.navigation.state.routeName);
	}

	dismiss = () => {
		this.setState({showEventsColorPicker: false});
	}

	render() {
		const { containerHeight, showEventsColorPicker } = this.state;

		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#166489'} />
				
				<EventsColorPicker visible={showEventsColorPicker}
					dismiss={() => this.dismiss()}/>

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

						<View style={styles.titleRow}>
							<MaterialIcons name="person-outline"
								size={30}
								color={blue} />
								
							<Text style={styles.title}>{this.strings.profile}</Text>
						</View>

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
							<Text style={styles.buttonText}>{this.props.language === 'en' ? 'Français' : 'English'}</Text>
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

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>{this.strings.notifications}</Text>
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
