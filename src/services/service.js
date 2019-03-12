import { formatData, getStartDate } from './helper';
import { insertEvent, getCalendarList, createSecondaryCalendar, getAvailabilities } from './google_calendar';
import { store } from '../store';
import { addGeneratedNonFixedEvent, addCourse } from '../actions';
import firebase from 'react-native-firebase';

let serverUrl = 'http://52.60.127.46:8080';

export let getIp = () => {
	if (__DEV__) {
		firebase.config().enableDeveloperMode();
	}
	
	firebase.config().fetch(0)
		.then(() => {
			return firebase.config().activateFetched();
		})
		.then((activated) => {
			if (!activated) console.log('Fetched data not activated');
			return firebase.config().getValue('ipAddress');
		})
		.then((snapshot) => {
			serverUrl = snapshot.val();
		})
		.catch(console.error);
};

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

export const analyzePicture = (base64Data) => {
	return new Promise( function(resolve, reject) { 
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
						InsertDataIntoGoogle(data)
							.then((promises) => {
								if(promises) resolve(true);
								else reject(false);
							})
							.catch(err => {
								console.log('err', err);
							});
					});
			});
	});
};


export const InsertDataIntoGoogle = (events) => {
	let promises = [];
	let calendarID = store.getState().CalendarReducer.id;

	events.forEach( event => {
		let tempStartDate = new Date('2019-02-01');
		event.courses.forEach(course => {
			// console.log('course', course);
			let obj = {
				'end': {
					'timeZone': 'UTC'
				},
				'start': {
					'timeZone': 'UTC'
				}
			};
			let startDate = getStartDate(tempStartDate, event.day);
			let endDate = getStartDate(tempStartDate, event.day);
			//let day = event.day.substr(0,2).toUpperCase();
			let recurrence = [
				'RRULE:FREQ=WEEKLY;UNTIL=20190327'
			];
			
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
			
			let courseReduxObj = obj;
			courseReduxObj.dayOfWeek = event.day;
			courseReduxObj.hours = d;

			store.dispatch(addCourse(courseReduxObj));
			
			promises.push(insertEvent(calendarID,obj,{}));
		});
	});
	return Promise.all(promises);
};

export const  InsertFixedEvent = (event) => {
	let calendarID = store.getState().CalendarReducer.id;
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

	return insertEvent(calendarID,obj,{});	
};

export const getCalendarID2 = () => {
	return new Promise( async function(resolve) { 
		await getCalendarList().then((data) => {
			let calendarID;
			for (let i = 0; i < data.items.length; i++) {
				if (data.items[i].summary === 'Kalend') {
					calendarID = data.items[i].id;
					console.log('found one!', calendarID);
				}
			}
			resolve(calendarID);
		});
	});
};

export const createCalendar = () => {
	return new Promise( function(resolve) { 
		createSecondaryCalendar({summary: 'Kalend'}).then((data) => {
			resolve(data.id);
		});
	});
};

export const generateSchedule = () => {
	return new Promise( function(resolve) {
		let nonFixedEvents = store.getState().NonFixedEventsReducer;
		
		if (nonFixedEvents.length == 0) return;
		
		nonFixedEvents.forEach(event => {
			ItterateOccurence(event);
		});

		resolve();
	});
};

async function ItterateOccurence(event) {
	let testedDates = [];
	let startDayTime = 8;
	let endDayTime = 22;

	for (let i = 0; i < event.occurrence; i++) {
		await findEmptySlots(startDayTime, endDayTime, event, testedDates).then(availableDate => {
			storeNonFixedEvent(availableDate, event);
		});
	}	
}

function findEmptySlots(startDayTime, endDayTime, event, testedDates) {
	let calendarID = store.getState().CalendarReducer.id;
	let obj = {};
	obj.timeZone = 'EST';
	obj.items = [{'id': calendarID}];

	return new Promise( async function(resolve) {
		let available = false;
	
		while(!available) {
			let startDate = new Date(event.startDate);
			let endDate = new Date(event.endDate);
			let eventHours = event.hours;
			let eventMinutes = event.minutes; 

			// Check if it is a specific Date Range
			if(event.specificDateRange == false) endDate.setDate(startDate.getDate() + 7);
			
			// Check if the total duration must be dicided
			if (event.isDividable) {
				let dividedDuration = divideDuration(event.hours, event.minutes, event.occurrence);
		
				eventHours = dividedDuration.hours;
				eventMinutes = dividedDuration.minutes;
			} 

			let randomStartTime = getRndInteger(startDayTime, endDayTime - eventHours);
			let randomDay = getRndInteger(startDate.getDate(), endDate.getDate());
			startDate.setHours(randomStartTime);
			startDate.setDate(randomDay);
			startDate = startDate.toISOString();

			// If random generated startDate has already been tested, move to the next itteration
			if (testedDates.includes(startDate)) continue;

			let randomEndTime = randomStartTime + eventHours;
			endDate.setHours(randomEndTime, eventMinutes);
			endDate.setDate(randomDay);
			endDate = endDate.toISOString();

			obj.timeMin = startDate;
			obj.timeMax = endDate;

			// Call to google to check whether time conflicts with the specified generated startDate;
			await getAvailabilities(obj).then(data => {
				let busySchedule = data.calendars[Object.keys(data.calendars)[0]].busy;
				if (busySchedule.length > 0) {
					console.log('slot already taken!');
					testedDates.push(startDate);
				} else {
					console.log(`found a free slot! Pushing the event! ${randomStartTime}`);
					available = true;
					resolve({startDate, endDate});
				}
			});
		}
	});

}

let storeNonFixedEvent = (availableDate, event) => {
	//let calendarID = store.getState().CalendarReducer.id;
	let obj = {
		'end': {},
		'start': {}
	};

	obj.end.timeZone = 'EST';
	obj.start.timeZone = 'EST';
	obj.summary = event.title;
	obj.location = event.location;
	obj.description = event.description;
	obj.end.dateTime = availableDate.endDate;
	obj.start.dateTime = availableDate.startDate;

	store.dispatch(addGeneratedNonFixedEvent(obj));
};

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

function divideDuration(__hours, __minutes, __occurence) {
	let totalDuration = (__hours * 60) + __minutes;
	let dividedDuration = totalDuration / __occurence;
	let { hours, minutes } = convertMintuesToHours(dividedDuration);
	
	return {hours, minutes};
}


function convertMintuesToHours(__duration) { 
	const hours = Math.floor(__duration / 60);  
	const minutes = __duration % 60;

	return {hours, minutes};         
}