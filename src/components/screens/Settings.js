import React from 'react';
import { StatusBar, View , TouchableOpacity, Text, Platform, Image, ScrollView, Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';
import { IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from 'react-navigation';
import { LoginNavigator, UnavailableRoute, SchoolInformationRoute, CleanReducersRoute } from '../../constants/screenNames';
import { settingsStyles as styles, blue } from '../../styles';
import updateNavigation from '../NavigationHelper';
import { googleSignOut } from '../../services/google_identity';
import { clearEveryReducer } from '../../services/helper';

const viewHeight = 669.1428833007812;

class Settings extends React.PureComponent {

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
			containerHeight
		};

		// Updates the navigation location in redux
		updateNavigation('Settings', props.navigation.state.routeName);
	}

	render() {
		const { containerHeight } = this.state;

		return(
			<View style={styles.container}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#166489'} />

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
								
							<Text style={styles.title}>Profile</Text>
						</View>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								this.props.navigation.navigate(UnavailableRoute);
							}}>
							<Text style={styles.buttonText}>Set Unavailable Hours</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								this.props.navigation.navigate(SchoolInformationRoute);
							}}>
							<Text style={styles.buttonText}>Set School Information</Text>
						</TouchableOpacity>

						<View style={styles.titleRow}>
							<MaterialCommunityIcons name="account-heart-outline"
								size={30}
								color={blue} />

							<Text style={styles.title}>Preferences</Text>
						</View>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Notifications</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Theme</Text>
						</TouchableOpacity>

						<View style={styles.titleRow}>
							<MaterialCommunityIcons name="cellphone-settings-variant"
								size={30}
								color={blue} />

							<Text style={styles.title}>General</Text>
						</View>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Help</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Reload Tutorial</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Reset/Delete Calendar</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Clear Cache/Data</Text>
						</TouchableOpacity>
						
						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>Privacy Policy</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={ ()=>{
							Linking.openURL('https://cdhstudio.ca/');
						}}>
							<Text style={styles.buttonText}>CDH Studio</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => {
								googleSignOut();
								clearEveryReducer();
								this.props.navigation.navigate(LoginNavigator);
							}}>
							<Text style={styles.buttonLogOutText}>Log out</Text>
						</TouchableOpacity>

						<Text style={styles.version}>Version 0.2.0</Text>
					</View>
				</ScrollView>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { HomeReducer } = state;

	let hasUserInfo = HomeReducer.profile != null;

	return {
		profileImage: hasUserInfo ? HomeReducer.profile.profile.user.photo : `https://api.adorable.io/avatars/285/${new Date().getTime()}.png`,
		userName: hasUserInfo ? HomeReducer.profile.profile.user.name : 'Unkown user'
	};
};

export default connect(mapStateToProps, null)(Settings);
