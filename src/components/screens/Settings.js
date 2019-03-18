import React from 'react';
import { StatusBar, View , TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { IconButton } from 'react-native-paper';
import { logoffUser } from '../../actions';
import { LoginNavigator, UnavailableRoute, SchoolInformationRoute, CleanReducersRoute } from '../../constants/screenNames';
import { settingsStyles as styles, blue } from '../../styles';
import updateNavigation from '../NavigationHelper';

class Settings extends React.Component {
	static navigationOptions = ({navigation}) => ({
		headerRight: (__DEV__ ? <IconButton
			icon="delete"
			onPress={() => navigation.navigate(CleanReducersRoute)}
			size={20}
			color={blue}/> : null)
	});

	constructor(props) {
		super(props);

		// Updates the navigation location in redux
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	render() {
		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle="light-content"
					backgroundColor={'#2d6986'} />

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

export default connect()(Settings);
