export const webClientId = '359972006564-9tngmtaigit300v7kqjr48sph3apvq38.apps.googleusercontent.com';
export const googleIdentityScope = ['profile', 'https://www.googleapis.com/auth/calendar'];
export const lightBlueColor = '#79a2d2';
export const blueColor = '#1473E6';
export const statusBlueColor = '#105dba';
export const darkBlueColor = '#0E4BAA';
export const lightOrangeColor = '#FFBF69';
export const orangeColor = '#FF9F1C';
export const imageRollCheck = '#764D16';
export const darkOrangeColor = '#FF621C';
export const redColor = '#b80000';
export const statusBarDark = '#00000050';
export const grayColor = '#565454';
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
// export const gradientColors = [blueColor, '#FFF'];
// export const gradientColors = ['#6FD6FF', '#BFF098'];
// export const gradientColors = ['#D8B5FF', '#1EAE98'];
// export const gradientColors = ['#00B7FF', '#FFFFC7'];
// export const gradientColors = ['#00B7FF', '#BFF098'];
// export const gradientColors = ['#D74177', '#FFE98A'];
// export const gradientColors = ['#38ADAE', '#CD295A'];
export const gradientColors = ['#32D2DC', '#345C83'];


export const slides = [
	{
		key: 'integration',
		title: 'School Schedule Integration',
		text: 'Add your school schedule by importing\na picture or a screenshot of your schedule',
		icon: 'ios-school',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'generator',
		title: 'Schedule Generator',
		text: 'Add your events and the activities you\nwould like to do and let the application\ngenerate the best schedules for you',
		icon: 'ios-calendar',
		colors: [orangeColor,'#FF621C'],
		color: '#FFE0B6'
	},
	{
		key: 'compare',
		title: 'Compare Schedule',
		text: 'Find availabilities by comparing schedules\nwith your friends and colleagues',
		icon: 'ios-people',
		colors: gradientColors,
		color: '#CBE0FA'
	},
	{
		key: 'done',
		title: 'Start right now\nwith Kalend!',
		text: '',
		icon: '',
		colors: [orangeColor,'#FF621C'],
	}
];