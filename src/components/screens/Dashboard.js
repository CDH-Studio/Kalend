import React from 'react';
import {StatusBar, Text, StyleSheet, View, Button} from 'react-native';
import { FAB, Portal } from 'react-native-paper';

class Dashboard extends React.Component {

	//Constructor and States
	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			opened: false,

			optionsOpen: false,
		};
	}

	render() {
		const {optionsOpen} = this.state;
		return(
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar translucent={true} backgroundColor={'#105dba'} />
				
				<Portal.Host>
					<FAB.Group
						open={optionsOpen}
						icon={optionsOpen ? 'close' : 'add'}
						actions={[
							{ icon: 'school', label: 'Add School Schedule', onPress: () => this.props.navigation.navigate('DashboardSchoolSchedule')},
							{ icon: 'today', label: 'Add Fixed Event', onPress: () => this.props.navigation.navigate('DashboardFixedEvent') },
							{ icon: 'face', label: 'Add Non-Fixed Event', onPress: () => this.props.navigation.navigate('DashboardNonFixedEvent') },
						]}
						onStateChange={() => this.setState({ optionsOpen: !optionsOpen })}
						style={styles.fab} /></Portal.Host>
			</View>
		);
	}
}

const styles = StyleSheet.create({

	fab: {
		position: 'absolute',
		right: 0,
	},
});

export default Dashboard;