import React from 'react';
import { StatusBar, TouchableOpacity, Text, View, Platform } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { store } from '../../store';
import updateNavigation from '../NavigationHelper';
import { dashboardStyles as styles, blue } from '../../styles';
import { ReviewEventRoute, SchoolScheduleRoute, FixedEventRoute, NonFixedEventRoute, SchoolInformationRoute, CourseRoute } from '../../constants/screenNames';

/**
 * Dashboard of the application which shows the user's calendar and
 * the differents options they can access.
 */
class Dashboard extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = { 
			containerHeight: null,
			opened: false,
			optionsOpen: false,
			isVisible: false
		};
		updateNavigation(this.constructor.name, props.navigation.state.routeName);
	}

	componentDidMount() {
		this.setState({isVisible: true});
	}

	showPopover = () =>{
		this.setState({isVisible: true});
	}
	
	closePopover = () => {
		this.setState({isVisible: false});
	}

	render() {
		const {optionsOpen} = this.state;

		return(
			<Portal.Host style={{flex:1}}>
				<View style={styles.content}>
					<StatusBar translucent={true}
						barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
						backgroundColor={'#166489'} />

					<TouchableOpacity style={styles.button}
						onPress={() => {
							this.props.navigation.navigate(ReviewEventRoute);
						}}>
						<Text style={styles.buttonText}>Create Schedule</Text>
					</TouchableOpacity>

					<FAB.Group
						ref={ref => this.touchable = ref}
						theme={{colors:{accent:blue}}}
						open={optionsOpen}
						icon={optionsOpen ? 'close' : 'add'}
						actions={[
							{icon: 'school',
								label: 'Add School Schedule',
								onPress: () => {
									if (store.getState().SchoolInformationReducer.info) {
										if (this.props.checked) {
											this.props.navigation.navigate(CourseRoute);
										} else {
											this.props.navigation.navigate(SchoolScheduleRoute);
										}
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

					{/* <View>
						<Popover popoverStyle={styles.tooltipView}
							isVisible={this.state.isVisible}
							fromView={this.touchable}
							onClose={() => this.closePopover()}>
							<Feather name="x"
								style={{top:-2.5, right: -2.5, justifyContent: "flex-end"}}
								size={25}
								color={black} />
							<Text style={styles.tooltipText}>I'm the content of this popover!</Text>
						</Popover>
					</View> */}
				</View>
			</Portal.Host>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		checked: state.SchoolInformationReducer.info.info.checked === 'third'
	};
};

export default connect(mapStateToProps, null)(Dashboard);
