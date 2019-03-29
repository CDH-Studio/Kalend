import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IndicatorViewPager, PagerTitleIndicator } from 'rn-viewpager';
import { setCourseColor, setFixedColor, setNonFixedColor } from '../actions';
import { eventsColorPickerStyles as styles } from '../styles';
import { calendarColors } from '../../config';

class EventsColorPicker extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			visible: props.visible,
		};
	}

	componentWillMount() {
		this.setState({
			selectedColors: [Number(this.props.courseColor), Number(this.props.fixedEventsColor), Number(this.props.nonFixedEventsColor)],
		});
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
	 * Renders the tabs in the modal
	 */
	renderTitleIndicator() {
		return <PagerTitleIndicator titles={['Courses', 'Fixed Events', 'Non-Fixed Events']}
			trackScroll={true}
			style={styles.pager}
			itemTextStyle={styles.pagerText}
			selectedBorderStyle={styles.pagerSelectedBorder}
			selectedItemTextStyle={styles.pagerSelectedText} />;
	}

	/**
	 * Dismisses the modal
	 */
	removeModal = () => {
		this.saveColors();
		this.setState({ visible: false });
		this.props.dismiss();
	}

	/**
	 * Saves the selected colors in redux
	 */
	saveColors = () => {
		this.props.setCourseColor(this.getCorrespondingColorIndex(this.state.selectedColors[0]));
		this.props.setFixedColor(this.getCorrespondingColorIndex(this.state.selectedColors[1]));
		this.props.setNonFixedColor(this.getCorrespondingColorIndex(this.state.selectedColors[2]));
	}

	/**
	 * Return the correct color index
	 */
	getCorrespondingColorIndex = (index) => {
		return Object.keys(calendarColors[index])[0];
	}

	/**
	 * Renders each slide in the viewPager in the modal
	 * 
	 * @param {Integer} num The index of the slide
	 */
	slide = (num) => {
		return <View style={styles.colorsSliderContainer}>
			<View style={styles.circleContainer}>
				{
					this.props.colors.map((color, key) =>
						<View key={key}>
							<TouchableOpacity style={[styles.circleColor, { backgroundColor: color }]}
								onPress={() => {
									let selectedColors = this.state.selectedColors;
									selectedColors[num] = key;
									this.setState({ selectedColors });
								}}>

								{
									this.state.selectedColors[num] === key ?
										<View style={styles.dimmedCircle}>
											<FontAwesome5 name={'check'}
												size={30}
												color={color} />
										</View>
										: null
								}
							</TouchableOpacity>
						</View>
					)
				}
			</View>
		</View>;
	}

	render() {
		const { visible } = this.state;
		console.log(this.state.selectedColors);

		return (
			<View style={styles.container}>
				<Modal isVisible={visible}
					onBackdropPress={this.removeModal}
					useNativeDriver>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Select Color for Events</Text>

						<IndicatorViewPager style={styles.viewPager}
							indicator={this.renderTitleIndicator()} >
							{this.slide(0)}
							{this.slide(1)}
							{this.slide(2)}
						</IndicatorViewPager>

						<View style={styles.button}>
							<TouchableOpacity onPress={this.removeModal}>
								<Text style={styles.buttonText}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

let mapStateToProps = (state) => {
	const { CalendarReducer } = state;
	console.log(CalendarReducer);
	let { courseColor, nonFixedEventsColor, fixedEventsColor } = CalendarReducer;

	let colors = [];
	calendarColors.map(data => {
		let i = Object.values(data)[0];
		if (i != undefined) {
			colors.push(i);
		}
	});

	// Object.values(calendarColors).map(i => {
	// 	if (i != undefined) {
	// 		colors.push('rgb(' + i[0] + ', ' + i[1] + ', ' + i[2] + ')');
	// 	}
	// });

	colors.push(CalendarReducer.calendarColor);

	// if ('colors' in CalendarReducer) {
	// 	if ('event' in CalendarReducer.colors) {
	// 		let { event } = CalendarReducer.colors;

	// // Formats the colors to only be in an array
	// let keys = Object.values(calendarColors);
	// colors = keys.map((key) => {
	// 	return event[key].background;
	// });

	// // Removes the three last colors (too vibrant)
	// colors.splice(-3, 3);
	// 	}
	// }

	return {
		colors,
		courseColor,
		nonFixedEventsColor,
		fixedEventsColor
	};
};

let mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ setFixedColor, setNonFixedColor, setCourseColor }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsColorPicker);