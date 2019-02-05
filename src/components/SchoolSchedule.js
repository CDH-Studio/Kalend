import React from 'react';
import {ImageBackground, StatusBar, StyleSheet, View, Image, Text, Platform, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class SchoolSchedule extends React.Component {

    static navigationOptions = {
        title: 'Add School Schedule',
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'Raleway-Regular'
        },
        headerTransparent: true,
        headerStyle: {
          backgroundColor: 'rgba(11, 63, 126, 0.4)',
          marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
        }
      };
    


    render() {
        return (
            <LinearGradient style={styles.container} colors={['#1473E6', '#0E55AA']}>
                <ImageBackground style={styles.container} source={require('../assets/img/loginScreen/backPattern.png')} resizeMode="repeat">
                    <StatusBar translucent={true} backgroundColor={'#00000050'} />
                    
                    <View style={styles.content}>
                        <View style={styles.instruction}>
							<Image style={styles.schoolIcon} source={require('../assets/img/schoolSchedule/school.png')} resizeMode="contain" />
							<Text style={styles.text}>Import your school schedule by importing or taking a picture</Text>
						</View>

                        <View>
                            <TouchableOpacity style={styles.buttonSelect} onPress={() => this.props.navigation.navigate('SchoolScheduleSelectPicture')}>
                                <Text style={styles.buttonSelectText}>SELECT A PICTURE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonTake} onPress={() => this.props.navigation.navigate('SchoolScheduleTakePicture')}>
                                <Text style={styles.buttonTakeText}>TAKE A PICTURE</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionIconRow}>
                                <Image style={styles.sectionIcon} source={require('../assets/img/schoolSchedule/sectionActive.png')} resizeMode="contain" />
                                <Image style={styles.sectionIcon} source={require('../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
                                <Image style={styles.sectionIcon} source={require('../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
                                <Image style={styles.sectionIcon} source={require('../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
                                <Image style={styles.sectionIcon} source={require('../assets/img/schoolSchedule/sectionInactive.png')} resizeMode="contain" />
                            </View>
                            <View>
                                <TouchableOpacity style={styles.skipButton}>
                                    <Text style={styles.skipButtonText}>Skip</Text>
                                </TouchableOpacity>
                            </View> 
                        </View>
                    </View>
                </ImageBackground>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '130%' //Fixes pattern bug
	},

	content: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 160
    },

    schoolIcon: {
		height: 130,
		width: 130
	},
    
    instruction: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

	text: {
		fontFamily: 'Raleway-Regular',
		color: '#FFFFFF',
		fontSize: 20,
        paddingTop: 30,
        paddingLeft: 15,
		textShadowColor: 'rgba(0, 0, 0, 0.40)',
		textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 20,
        width: 220
    },
    
    buttonSelect: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        padding: 17,
        alignItems: 'center',
        width: 300
    },

    buttonSelectText: {
        fontFamily: 'Raleway-Regular',
        fontSize: 15,
        color: '#1473E6'
    },

    buttonTake: {
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        padding: 17,
        alignItems: 'center',
        marginTop: 20,
        width: 300
    },

    buttonTakeText: {
        fontFamily: 'Raleway-Regular',
        fontSize: 15,
        color: '#FFFFFF'
    },

    section: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 10
    },

    sectionIconRow: {
        flexDirection: 'row'
    },

    sectionIcon: {
        width: 20,
        height: 20,
        margin: 8
    },

    skipButton: {
        marginTop: 5,
        marginLeft: 20,
        justifyContent: 'flex-end'
    },

    skipButtonText: {
        color: 'white',
        fontFamily: 'Raleway-Regular',
        fontSize: 15
    }
});

export default SchoolSchedule;