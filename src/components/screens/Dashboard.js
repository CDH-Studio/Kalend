import React from 'react';
import { StatusBar, View, Button, Text } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import updateNavigation from '../NavigationHelper';
import { persistor } from '../../store';
import { dashboardStyles as styles, blue, statusBlueColor } from '../../styles';
import { DashboardSchoolSchedule, DashboardEditFixedEvent, DashboardEditNonFixedEvent, LoginNavigator } from '../../constants/screenNames';

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
			<View style={styles.content}>
				<StatusBar translucent={true}
					backgroundColor={statusBlueColor} />

				<Text>Redux Management</Text>
				<Button title='Purge' 
					onPress={() => {
						persistor.purge();
					}}>
				</Button>
				<Button title='Go back home'
					onPress={() => {
						this.props.navigation.navigate(LoginNavigator);
					}}>
				</Button>
				
				<Portal.Host>
					<FAB.Group
						theme={{colors:{accent:blue}}}
						open={optionsOpen}
						icon={optionsOpen ? 'close' : 'add'}
						actions={[
							{icon: 'school',
								label: 'Add School Schedule',
								onPress: () => this.props.navigation.navigate(DashboardSchoolSchedule)},
							{icon: 'today',
								label: 'Add Fixed Event',
								onPress: () => this.props.navigation.navigate(DashboardEditFixedEvent)},
							{icon: 'face',
								label: 'Add Non-Fixed Event',
								onPress: () => this.props.navigation.navigate(DashboardEditNonFixedEvent)},
						]}
						onStateChange={() => this.setState({optionsOpen: !optionsOpen})}
						style={styles.fab} />
				</Portal.Host>
			</View>
		);
	}
}

export default Dashboard;