import { formatData, getStartDate } from './helper';
import { insertEvent } from './google_calendar';

const serverUrl = 'http://52.60.127.46:8080';
//const serverUrl = 'http://192.168.0.13:8080';
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

export const analyzePicture = (base64Data) => {
	fetch(`${serverUrl}/api/analyzepicture`, {
		method:'POST',
		body: JSON.stringify(base64Data),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
		.then(res => {
			return res.json();
		})
		.then(body => {
			formatData(body.data)
				.then(data => {
					InsertDataIntoGoogle(data);
				});
		})
		.catch(error => {
			console.log('error', error);
		});
};


export const InsertDataIntoGoogle = (events) => {
	
	events.forEach( event => {
		let tempStartDate = new Date('2019-02-01');
		let obj = {
			'end': {
				'timeZone': 'EST'
			},
			'start': {
				'timeZone': 'EST'
			}
		};
			
		event.courses.forEach(course => {
			let startDate = getStartDate(tempStartDate, event.day);
			let endDate = getStartDate(tempStartDate, event.day);
			let recurrence = [
				`RRULE:FREQ=WEEKLY;UNTIL=20190327;BYDAY=${day}`
			];
			let day = event.day.substr(0,2).toUpperCase();
			// Convert all letters to lowercase for easier formating
			let d = course.time.toLowerCase();
			// Split date accordingly if it has '-' or ' '
			d = (d.indexOf('-') !== -1) ? d.split('-') : d.split(' ');	
			d = d.map(i => {
				// Remove spaces
				i =  i.replace(' ', '');
				// Get am/pm
				let period = i.substr(-2);
				// Fix the case where Tesseract reads PM as PN
				period = (period == 'pn') ? 'pm': period;
				// Split on colon
				i = i.slice(0, -2).split(':');
				// Add period to the array after split: format['11','20','am']
				i.push(period);
				return i;
			});
			// Check if startDate, EndDate period is pm, if so add 12 to it to convert it into 24hours clock
			startDate.setHours((d[0][2] === 'pm'  && parseInt(d[0][0]) !== 12 ? 12 : 0) + parseInt(d[0][0]), parseInt(d[0][1]), 0);
			endDate.setHours((d[1][2] === 'pm' && parseInt(d[1][0]) !== 12 ? 12 : 0) + parseInt(d[1][0]), parseInt(d[1][1]), 0);

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

export const  InsertFixedEvent = (event) => {
	let obj = {
		'end': {
			'timeZone': 'EST'
		},
		'start': {
			'timeZone': 'EST'
		}
	};

	if(event.recurrence != 'NONE') {
		let recurrence = [
			`RRULE:FREQ=${event.recurrence};`
		];
		obj.recurrence = recurrence;
	}
	
	if(event.allDay) {
		obj.end.date = new Date(event.endDate).toJSON().split('T')[0];
		obj.start.date =  new Date(event.startDate).toJSON().split('T')[0];
	} else {
		obj.end.dateTime = new Date(event.endDate + ` ${event.endTime}`).toJSON();
		obj.start.dateTime = new Date(event.startDate + ` ${event.startTime}`).toJSON();
	}
	obj.summary = event.title;
	obj.location = event.location;
	obj.description = event.description;

	return new Promise( function(resolve, reject) {
		insertEvent('kalend613@gmail.com',obj,{})
			.then( data => {
				console.log('data', data);
				if(data.error) {
					reject(false);
				} else {
					resolve(true);
				}
			});
	});
};