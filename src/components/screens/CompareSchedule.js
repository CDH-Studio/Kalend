import React from 'react';
import { StatusBar, View, Platform, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { compareScheduleStyles as styles } from '../../styles';
import updateNavigation from '../NavigationHelper';

class MyListItem extends React.PureComponent {
	_onPress = () => {
		this.props.onPressItem(this.props.id);
	};
  
	render() {
		console.log(this.props);
		return (
			<View>
				<Checkbox.Android status={this.props.selected ? 'checked' : 'unchecked'}
					onPress={this._onPress} />
			</View>
		);
	}
}

class CompareSchedule extends React.PureComponent {

	constructor(props) {
		super(props);

		let userAvailabilities = [1, 2, 3];
		let userAvailabilitiesChecked = userAvailabilities.map(() => true);

		this.state = {
			userAvailabilities,
			userAvailabilitiesChecked,
			selected: (new Map())
		};

		updateNavigation('CompareSchedule', props.navigation.state.routeName);
	}

	_onPressItem = (id) => {
		// updater functions are preferred for transactional updates
		this.setState((state) => {
		  // copy the map rather than modifying state.
		  const selected = new Map(state.selected);
		  selected.set(id, !selected.get(id)); // toggle
		  return {selected};
		}, () => 
		console.log(this.state));
	};
	

	_renderItem = ({item, index}) => {
		return (<MyListItem
			id={index}
			onPressItem={this._onPressItem}
			selected={!!this.state.selected.get(index)}
			title={item} />
		);
	};

	render() {
		const { userAvailabilities } = this.state;

		return(
			<View style={styles.content}>
				<StatusBar translucent={true} 
					barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
					backgroundColor={'#166489'} />

				<FlatList data={userAvailabilities}
					renderItem={this._renderItem}
					extraData={this.state} />
			</View>
		);
	}
}

export default CompareSchedule;