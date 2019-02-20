import React from 'react';
import {Platform, StatusBar, StyleSheet, ScrollView, View, Text} from 'react-native';
import EventOverview from '../EventOverview';

class ReviewEvent extends React.Component {

	static navigationOptions = {
		title: 'Review Events',
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Raleway-Regular'
		},
		headerTransparent: true,
		headerStyle: {
			backgroundColor: '#1473E6',
			marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	render() {
		//For category colors
		const school = 'green';
		const fixed = 'blue';
		const nonFixed = 'purple';

		return(
			<View style={styles.Container}>
				<StatusBar backgroundColor={'#105dba'} />

				<ScrollView contentContainerStyle={styles.content}>
					<View>
						<Text style={styles.sectionTitle}>School Schedule</Text>
						<EventOverview category={school} eventTitle={'Intro. to Software Engineering'} date={'Wednesday'} time={'1PM - 3PM'} />
					</View>

					<View>
						<Text style={styles.sectionTitle}>Fixed Events</Text>
						<EventOverview category={fixed} eventTitle={'Holidays'} date={'Dec 25, 2018 - Jan 1, 2019'} time={'All-Day'} />
					</View>

					<View>
						<Text style={styles.sectionTitle}>Non-Fixed Events</Text>
						<EventOverview category={nonFixed} eventTitle={'Comp. Sci. Assignment'} date={'Feb 4, 2019'} time={'3h'} />
					</View>
				</ScrollView>
			</View>
		);
	}
}

export default ReviewEvent;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	content: {
		flexGrow: 1,
		marginTop: 100,
		paddingLeft: 25,
		paddingRight: 25
	},

	sectionTitle: {
		color: '#565454',
		fontFamily: 'Raleway-SemiBold',
		fontSize: 20,
		marginBottom: 5
	},
});