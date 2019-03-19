import React from 'react';
import { StatusBar, View , TouchableOpacity, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { IconButton } from 'react-native-paper';
import { logoffUser } from '../../actions';
import { LoginNavigator, UnavailableRoute, SchoolInformationRoute, CleanReducersRoute } from '../../constants/screenNames';
import { settingsStyles as styles, blue } from '../../styles';

class Settings extends React.Component {
	static navigationOptions = ({navigation}) => ({
		headerRight: (__DEV__ ? <IconButton
			icon="delete"
			onPress={() => navigation.navigate(CleanReducersRoute)}
			size={20}
			color={blue}/> : null)
	});

	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					backgroundColor={'#2d6986'} />

				<View style={styles.topProfileContainer}>
					<Image style={styles.profileImage}
						source={{uri: this.props.profileImage}} />

					<Text style={styles.profileDescription}>
						Hi {this.props.userName}, here are your events for the day
					</Text>
				</View>

				<TouchableOpacity style={styles.button}
					onPress={() => {
						this.props.dispatch(logoffUser());
						this.props.navigation.navigate(LoginNavigator);
					}}>
					<Text style={styles.buttonText}>Log out</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button}
					onPress={() => {
						this.props.navigation.navigate(UnavailableRoute);
					}}>
					<Text style={styles.buttonText}>Set unavailable hours</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button}
					onPress={() => {
						this.props.navigation.navigate(SchoolInformationRoute);
					}}>
					<Text style={styles.buttonText}>Set school information</Text>
				</TouchableOpacity>
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
