import { getStrings } from '../src/services/helper';

export const webClientId = '359972006564-9tngmtaigit300v7kqjr48sph3apvq38.apps.googleusercontent.com';
export const googleIdentityScope = ['profile', 'https://www.googleapis.com/auth/calendar'];

export const calendarColors = [
	{'4': 'rgb(216, 129, 119)'},
	{'11': 'rgb(196, 40, 27)'},
	{'5': 'rgb(238, 191, 75)'},
	{'6': 'rgb(226, 92, 51)'},
	{'2': 'rgb(93, 178, 126)'},
	{'10': 'rgb(57, 125, 73)'},
	{'7': 'rgb(65, 155, 223)'},
	{'9': 'rgb(65, 84, 175)'},
	{'1': 'rgb(123, 135, 198)'},
	{'3': 'rgb(130, 51, 164)'},
	{'8': 'rgb(97, 97, 97)'},
	{'0': null}
];

export const calendarInsideColors = [
	{'4': 'rgb(227, 166, 159)'},
	{'11': 'rgb(226, 61, 48)'},
	{'5': 'rgb(242, 208, 122)'},
	{'6': 'rgb(232, 128, 96)'},
	{'2': 'rgb(128, 194, 154)'},
	{'10': 'rgb(73, 160, 93)'},
	{'7': 'rgb(109, 178, 230)'},
	{'9': 'rgb(95, 113, 196)'},
	{'1': 'rgb(159, 167, 213)'},
	{'3': 'rgb(159, 69, 197)'},
	{'8': 'rgb(123, 123, 123)'},
	{'0': null}
];

export const gradientColors = ['#32D2DC', '#153d73'];

console.log(getStrings());

const slidesInfo = getStrings().WelcomeScreen;
export const slides = [
	{
		key: 'integration',
		title: slidesInfo.title[0],
		text: slidesInfo.description[0],
		icon: 'ios-school',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'generator',
		title: slidesInfo.title[1],
		text: slidesInfo.description[1],
		icon: 'ios-calendar',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'compare',
		title: slidesInfo.title[2],
		text: slidesInfo.description[2],
		icon: 'ios-people',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'done',
		title: slidesInfo.title[3],
		text: '',
		icon: '',
		colors: gradientColors,
	}
];