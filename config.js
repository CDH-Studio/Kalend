import { getStrings } from './src/services/helper';

export const webClientId = '359972006564-9tngmtaigit300v7kqjr48sph3apvq38.apps.googleusercontent.com';
export const googleIdentityScope = ['profile', 'https://www.googleapis.com/auth/calendar'];

export const calendarEventColors = {
	red: '#E57B73',
	green: '#36B478',
	purple: '#7885CA'
};

export const calendarEventColorsInside = {
	red: '#EDA49E',
	green: '#52CB91',
	purple: '#9DA6D8'
};

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