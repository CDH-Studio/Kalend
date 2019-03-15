import React from 'react';
import { StatusBar, TouchableOpacity, Text, Image, View } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue } from '../../styles';
import { ReviewEventRoute, SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, SchoolInformationRoute } from '../../constants/screenNames';

/**
 * Dashboard of the application which shows the user's calendar and
 * the differents options they can access.
 */
class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			opened: false,
			optionsOpen: false,
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	render() {
		const {optionsOpen} = this.state;

		return(
			<Portal.Host style={{flex:1}}>
				<View style={styles.content}>
					<StatusBar translucent={true}
						backgroundColor={'#2d6986'} />
	
					<View style={styles.topProfileContainer}>

						<Image style={styles.profileImage}
							source={{uri: this.props.profileImage}} />

						<Text style={styles.profileDescription}>
							Hi {this.props.HomeReducer.profile.profile.user.name}, here are your events for the day
						</Text>
					</View>

					<TouchableOpacity style={styles.button}
						onPress={() => {
							this.props.navigation.navigate(ReviewEventRoute);
						}}>
						<Text style={styles.buttonText}>Create Schedule</Text>
					</TouchableOpacity>

					<FAB.Group
						theme={{colors:{accent:blue}}}
						open={optionsOpen}
						icon={optionsOpen ? 'close' : 'add'}
						actions={[
							{icon: 'school',
								label: 'Add School Schedule',
								onPress: () => {
									if (store.getState().SchoolInformationReducer.info) {
										this.props.navigation.navigate(SchoolScheduleRoute);
									} else {
										this.props.navigation.navigate(SchoolInformationRoute, {schoolSchedule: true});
									}
								}
							},
							{icon: 'today',
								label: 'Add Fixed Event',
								onPress: () => this.props.navigation.navigate(FixedEventRoute)},
							{icon: 'face',
								label: 'Add Non-Fixed Event',
								onPress: () => this.props.navigation.navigate(NonFixedEventRoute)},
						]}
						onStateChange={() => this.setState({optionsOpen: !optionsOpen})}
						style={styles.fab} />

				</View>
			</Portal.Host>
		);
	}
}

let mapStateToProps = (state) => {
	const { HomeReducer, SchoolInformationReducer } = state;

	let hasUserInfo = HomeReducer.profile != null;

	return {
		HomeReducer,
		hasSchoolInformation: SchoolInformationReducer.info != null,
		profileImage: hasUserInfo ? HomeReducer.profile.profile.user.photo : `https://api.adorable.io/avatars/285/${new Date().getTime()}.png`,
		userName: hasUserInfo ? HomeReducer.profile.profile.user.name : 'Unkown user'
	};
};

export default connect(mapStateToProps, null)(Dashboard);
