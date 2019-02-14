import { formatData, getStartDate } from './helper';
import { insertEvent } from './google_calendar';

const serverUrl = 'http://35.183.124.143:8080';

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
			formatData(body.data)
				.then(data => {
					InsertDataIntoGoogle(data);
				});
			//InsertDataIntoGoogle(data)
		})
		.catch(error => {
			console.log('error', error);
		});
};


export const InsertDataIntoGoogle = (events) => {
	let obj = {
		'end': {
			'timeZone': 'EST'
		},
		'start': {
			'timeZone': 'EST'
		}
	};

	events.forEach( event => {
		let tempStartDate = new Date('2019-02-01');
	
	
		let day = event.day.substr(0,2).toUpperCase();
		event.courses.forEach(course => {
			// Splits the time into different arrays for startTime and endTime
			let d = course.time.split('-').map(i => i.split(' ')).map(i => i.map(i => i.split(':')));
			let startDate = getStartDate(tempStartDate, event.day);
			let endDate = getStartDate(tempStartDate, event.day);
			startDate.setHours((d[0][1][0] === 'pm'  && parseInt(d[0][0][0]) !== 12 ? 12 : 0) + parseInt(d[0][0][0]), parseInt(d[0][0][1]), 0);
			endDate.setHours((d[1][1][0] === 'pm' && parseInt(d[1][0][0]) !== 12 ? 12 : 0) + parseInt(d[1][0][0]), parseInt(d[1][0][1]), 0);

			let recurrence = [
				`RRULE:FREQ=WEEKLY;UNTIL=20190327;BYDAY=${day}`
			];

			obj.end.dateTime = endDate.toJSON();
			obj.start.dateTime = startDate.toJSON();
			obj.summary = course.name;
			obj.location = course.location;
			obj.recurrence = recurrence;
			
			insertEvent('kalend613@gmail.com',obj,{})
				.then( data => {
					console.log('data', data);
				})
				.catch( err => {
					console.log('err', err);
				});
		});
	});
	
};

/*
export const InsertDataIntoGoogle = (events) => {
	let obj = {
		'end': {
			'timeZone': 'EST'
		},
		'start': {
			'timeZone': 'EST'
		}
	};

	events.forEach( event => {
		let tempStartDate = new Date('2019-02-01');
		let startDate = getStartDate(tempStartDate, event.day);
		console.log('refinedDate', startDate);

		let day = event.day.substr(0,2).toUpperCase();
		event.courses.forEach(course => {
			let startTime = convertTimeToGoogle(course.time[0]);
			let endTime =  convertTimeToGoogle(course.time[1]);
			let startDateTime = `${startDate}T${startTime}`;
			let endDateTime = `${startDate}T${endTime}`;
			let recurrence = [
				`RRULE:FREQ=WEEKLY;UNTIL=20190327;BYDAY=${day}`
			];

			obj.end.dateTime = endDateTime;
			obj.start.dateTime = startDateTime;
			obj.summary = course.name;
			obj.location = course.location;
			obj.recurrence = recurrence;
			
			// insertEvent('kalend613@gmail.com',obj,{})
			// 	.then( data => {
			// 		console.log('data', data);
			// 	})
			// 	.catch( err => {
			// 		console.log('err', err);
			// 	});
		});
	});
	
};
*/