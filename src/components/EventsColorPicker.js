import React from 'react';
import { View, Text, Platform, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome5';
import { IndicatorViewPager, PagerTitleIndicator } from 'rn-viewpager';
import { dark_blue, gray, white } from '../styles';

class EventsColorPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible,
            selectedColors: [2, 3, 5]
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            visible: newProps.visible,
        });
    }

    page = (num) => {
        let width = Dimensions.get('window').width;

        return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 5, width: width > 240 ? 240 : width }}>
                {
                    this.props.colors.map((color, key) =>
                        <View key={key}>

                            <TouchableOpacity
                                style={{
                                    justifyContent: 'center',
                                    backgroundColor: color,
                                    alignItems: 'center',
                                    borderRadius: 25,
                                    width: 50,
                                    margin: 5,
                                    height: 50,
                                    ...Platform.select({
                                        ios: {
                                            shadowColor: '#000000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 3,
                                        },
                                        android: {
                                            elevation: 4,
                                        },
                                    }),
                                }}
                                onPress={() => {
                                    let selectedColors = this.state.selectedColors;
                                    selectedColors[num] = key;
                                    this.setState({ selectedColors });
                                }}>

                                {
                                    this.state.selectedColors[num] === key ?
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#00000040',
                                                borderRadius: 25,
                                                width: 50,
                                                height: 50,
                                            }} >
                                            <MaterialCommunityIcons style={{}} name={'check'} size={30} color={color} />
                                        </View>
                                        : null
                                }
                            </TouchableOpacity>
                        </View>)
                }
            </View>
        </View>);
    }

    _renderTitleIndicator() {
        return <PagerTitleIndicator titles={['Courses', 'Fixed Events', 'Non-Fixed Events']}
            trackScroll={true}
            style={{
                backgroundColor: 'white',
                height: 48
            }}
            itemTextStyle={{ color: gray, fontFamily: 'Raleway-Medium' }}
            selectedBorderStyle={{
                height: 3,
                backgroundColor: dark_blue
            }}
            selectedItemTextStyle={{ color: dark_blue, fontFamily: 'Raleway-Bold' }} />;
    }

    removeModal = () => {
        this.setState({ visible: false });
        this.props.dismiss();
    }

    render() {
        const { visible } = this.state;

        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Modal isVisible={visible}transparent={false}
                    deviceHeight={Dimensions.get('window').height + (Platform.OS === 'ios' ? 0 : StatusBar.currentHeight)}
                    style={{
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                            },
                            android: {
                                elevation: 4,
                            },
                        }),}}
                    onBackdropPress={this.removeModal}
                    useNativeDriver>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', borderRadius: 5, backgroundColor: white, height: '50%' }}>

                        <Text style={{ fontFamily: 'Raleway-Medium', color: dark_blue, padding: 15, fontSize: 20, paddingLeft: 20 }}>Select Color for Events</Text>

                        <IndicatorViewPager style={{ flex: 1, flexDirection: 'column-reverse' }}
                            indicator={this._renderTitleIndicator()} >
                            {this.page(0)}
                            {this.page(1)}
                            {this.page(2)}
                        </IndicatorViewPager>
                        <View style={{ justifyContent: 'flex-end', width: '100%', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={this.removeModal}>
                                <Text style={{ fontFamily: 'Raleway-Bold', color: dark_blue, fontSize: 16, padding: 15, paddingRight: 20 }}>Save</Text>
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
    let { event } = CalendarReducer.colors;

    let keys = Object.keys(event);
    let colors = keys.map((key) => {
        return event[key].background;
    })

    colors.splice(-3, 3)

    return { colors };
};

export default connect(mapStateToProps, null)(EventsColorPicker);