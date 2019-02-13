import { formatData } from './helper';
import { insertEvent } from './google_calendar';

const serverUrl = 'http://192.168.0.13:8080';

export const grabSampleData = () =>  {
	fetch(`${serverUrl}/api/test`)
		.then(res =>  {
			return res.json();
		})
		.then( data => {
			//console.log('data', data);
			return data;
		}).catch(error => {
			console.log('error', error);
		});
}; 

export const grabUserData = () =>  {
	fetch(`${serverUrl}/api/users`)
		.then(res =>  {
			return res.json();
		})
		.then( data => {
			console.log('data', data);
			return data;
		}).catch(error => {
			console.log('error', error);
		});
};

export const analyzePicture = () => {
	fetch(`${serverUrl}/api/analyzepicture`)
		.then(res => {
			return res.json();
		})
		.then(body => {
			let data = formatData(body.data);
			return data;
		})
		.catch(error => {
			console.log('error', error);
		});
};

export const InsertDataIntoGoogle = (data) => {
	console.log('inside insert function', data);
	let obj = {
		'end': {
			'dateTime': '2019-02-13T13:00:00',
			'timeZone': 'America/Los_Angeles'
		},
		'start': {
			'dateTime': '2019-02-13T11:00:00',
			'timeZone': 'America/Los_Angeles'
		},
		'summary': 'Test event!',
		'recurrence': [
			'RRULE:FREQ=WEEKLY;UNTIL=20190627'
		],
		'location': 'TB 340'
	};
	insertEvent('kalend613@gmail.com',obj,{})
		.then( data => {
			console.log('data', data)
		})
		.catch( err => {
			console.log('err', err);
		});

};