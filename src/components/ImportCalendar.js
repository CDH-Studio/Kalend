import React from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { importCalendarStyles as styles } from '../styles';
import { getCalendarList, listEvents } from '../services/google_calendar';
import { RadioButton } from 'react-native-paper';

class ImportCalendar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			visible: props.visible,
			data: [],
			selected: 0
		};
	}

	componentWillMount() {
		this.getCalendars();
	}

	/**
	 * Gets the new value of visible and updates it in the props
	 */
	componentWillReceiveProps(newProps) {
		this.setState({
			visible: newProps.visible,
		});
	}

	/**
	 * Dismisses the modal
	 */
	removeModal = () => {
		// this.importEvents();
		this.setState({ visible: false });
		// this.props.dismiss();
	}

	getCalendars = async () => {
		let data = await getCalendarList();

		// Only shows calendar in which the user is owner of and removes the Kalend calendar from the list
		data = data.items.filter(i => i.accessRole === 'owner' && i.id !== this.props.calendarId);

		// Cleans the data
		data = data.reduce((acc, i) => {
			acc.push({
				id: i.id,
				title: i.summary,
				color: i.backgroundColor
			});

			return acc;
		}, []);


		this.setState({data});
	}

	_renderItem = ({item, index}) => {
		return (
			<View style={styles.itemView}>
				<RadioButton.Android value={index} 
					uncheckedColor={item.color}
					color={item.color} 
					onPress={() => this.setState({selected: index})}
					status={this.state.selected === index ? 'checked' : 'unchecked'}/>
				<TouchableOpacity onPress={() => this.setState({selected: index})}>
					<Text style={styles.itemText}>{item.title}</Text>
				</TouchableOpacity>
			</View>
		);
	}

	importEvents = async () => {
		let selectedCalendar = this.state.data[this.state.selected].id;

		let data = await listEvents('selectedCalendar');
		console.log(data);


	}

	render() {
		const { visible, data } = this.state;

		return(
			<View style={styles.container}>
				<Modal isVisible={visible}
					onBackdropPress={this.removeModal}
					useNativeDriver>
					<View style={styles.modalContent}>
						<Text style={styles.title}>Select a Calendar to Import</Text>

						<FlatList data={data}
							style={styles.flatlist}
							renderItem={this._renderItem}
							extraData={this.state}
							keyExtractor={(item, index) => index.toString()} />

						<View style={styles.buttons}>
							<TouchableOpacity onPress={this.removeModal}>
								<Text style={styles.buttonCancelText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={this.importEvents}>
								<Text style={styles.buttonText}>Import</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	return {
		calendarId: state.CalendarReducer.id
	};
}

export default connect(mapStateToProps)(ImportCalendar);