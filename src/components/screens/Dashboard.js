import React from 'react';
import { StatusBar, TouchableOpacity, Text } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue } from '../../styles';
import { ReviewEventRoute, SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute } from '../../constants/screenNames';

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
			<Portal.Host style={[styles.content, {flex:1}]}>
				<StatusBar translucent={true}
					backgroundColor={blue} />

				<TouchableOpacity style={{elevation: 4, backgroundColor: blue, padding: 5, borderRadius: 5, margin: 5}}
					onPress={() => {
						this.props.navigation.navigate(ReviewEventRoute);
					}}>
					<Text style={{color: 'white'}}>Create Schedule</Text>
				</TouchableOpacity>
				<FAB.Group
					open={optionsOpen}
					icon={optionsOpen ? 'close' : 'add'}
					actions={[
						{icon: 'school',
							label: 'Add School Schedule',
							onPress: () => this.props.navigation.navigate(SchoolScheduleRoute)},
						{icon: 'today',
							label: 'Add Fixed Event',
							onPress: () => this.props.navigation.navigate(FixedEventRoute)},
						{icon: 'face',
							label: 'Add Non-Fixed Event',
							onPress: () => this.props.navigation.navigate(NonFixedEventRoute)},
					]}
					onStateChange={() => this.setState({optionsOpen: !optionsOpen})}
					style={styles.fab} />
			</Portal.Host>
		);
	}
}

export default Dashboard;