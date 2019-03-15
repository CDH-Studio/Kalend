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

/**
 *	Function call to send base64 img to python server and have OCR extraction on the image
 * 
 * @param {String} base64Data base64 img string
 */
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
						storeCoursesEvents(data)
							.then((success) => {
								if(success) resolve(true);
								else reject(false);
							})
							.catch(err => {
								console.log('err', err);
							});
					});
			});
	});
};

/**
 *	Insert's All Courses event into the Google Calendar
 * 
 * @param {Array} events an array of all courses events 
 */
export const storeCoursesEvents = (events) => {
	// let promises = [];
	// let calendarID = store.getState().CalendarReducer.id;
	return new Promise( function(resolve) {
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
				//promises.push(insertEvent(calendarID,obj,{}));
			});
		});
		resolve(true);
	//return Promise.all(promises);
	});
};

/**
 *	Insert's fixed Event into the Google Calendar
 * 
 * @param {Object} event state object of the event
 */
export const  InsertFixedEventToCalendar = (event) => {
	let calendarID = store.getState().CalendarReducer.id;
	let obj = {
		'end': {
			'timeZone': 'UTC'
		},
		'start': {
			'timeZone': 'UTC'
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

export const InsertCourseEventToCalendar = (event) => {
	let calendarID = store.getState().CalendarReducer.id;

	let obj = { 
		'end': {},
		'start': {}
	};
	obj.end.timeZone = 'UTC';
	obj.start.timeZone = 'UTC';
	obj.end.dateTime = event.end.dateTime;
	obj.start.dateTime = event.start.dateTime;
	obj.recurrence = event.recurrence;
	obj.location = event.location;
	obj.description = event.description;
	obj.summary = event.summary;

	return insertEvent(calendarID,event,{});	
};
/**
 *	Checks if 'Kalend' Calendar is available, if so returns the ID of the 'Kalend' Calendar
 */
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

/**
 *	Creates a new calendar, and returns calendarID as a promise
 */
export const createCalendar = () => {
	return new Promise( function(resolve) { 
		createSecondaryCalendar({summary: 'Kalend'}).then((data) => {
			resolve(data.id);
		});
	});
};

/**
 *	Loops through all the non fixed events and generates events which are pushed to redux store
 */
export const generateNonFixedEvents =  () => {
	
	let nonFixedEvents = store.getState().NonFixedEventsReducer;

	let promises = [];
	if (nonFixedEvents.length == 0) return;
	
	nonFixedEvents.forEach( (event) => {
		promises.push(new Promise(async function (resolve) {
			await ItterateOccurence(event).then( () => {
				resolve();
			});
		}));
	});
	return Promise.all(promises);
};

export const eventsToScheduleSelectionData = () => {
	let data = {
		fixedEvents: [],
		schoolEvents: [],
		aiEvents:[[]],
		school: [],
		fixed: [],
		ai: [[]]
	};
	data.schoolEvents = store.getState().CoursesReducer;
	data.fixedEvents = store.getState().FixedEventsReducer;
	data.aiEvents[0] = store.getState().GeneratedNonFixedEventsReducer;
	return new Promise((resolve) => {
		data.schoolEvents.forEach(event  => {
			let startDateTime = new Date(event.start.dateTime);
			let endDateTime = new Date(event.end.dateTime);
			let day = startDateTime.getDay();
			let start =  startDateTime.getHours();
			let end =  Math.ceil(endDateTime.getHours() + endDateTime.getMinutes()/60);
			let chunks = end - start;
			
			let obj = {
				day,
				chunks,
				start
			};
			data.school.push(obj);
		});

		data.fixedEvents.forEach(event  => {
			let startDateTime = new Date(`${event.startDate} ${event.startTime}`); 
			let endDateTime = new Date(`${event.endDate} ${event.endTime}`); 
			let day = startDateTime.getDay();
			let start =  startDateTime.getHours();
			let end =  Math.ceil(endDateTime.getHours() + endDateTime.getMinutes()/60);
			let chunks = end - start;
			
			let obj = {
				day,
				chunks,
				start
			};
			data.fixed.push(obj);
		});

		data.aiEvents[0].forEach(event  => {
			let startDateTime = new Date(event.start.dateTime);
			let endDateTime = new Date(event.end.dateTime);
			let day = startDateTime.getDay();
			let start =  startDateTime.getHours();
			let end =  Math.ceil(endDateTime.getHours() + endDateTime.getMinutes()/60);
			let chunks = end - start;
			
			let obj = {
				day,
				chunks,
				start
			};
			data.ai[0].push(obj);
		});
		resolve(data);
	});
};

/**
 *	Itterates over the number of Occurences
 * 
 * @param {Object} event state object of the event
 */
async function ItterateOccurence(event) {
	
	let testedDates = [];
	let startDayTime = 8;
	let endDayTime = 22;
	let promises = [];

	for (let i = 0; i < event.occurrence; i++) {
	
		await findEmptySlots(startDayTime, endDayTime, event, testedDates).then(availableDate => {
			promises.push(storeNonFixedEvent(availableDate, event));
		});
	}
	return Promise.all(promises);	
}

/**
 *	Find the available date in the google calendar
 * 
 * @param {integer} startDayTime this is a temporary input atm, which indicates when the user's day starts
 * @param {integer} endDayTime this is a temporary input atm, which indicates when the user's day ends 
 * @param {Object} event state object of the event
 * @param {Array} testedDates Array of dates where the slots are not available
 */
function findEmptySlots(startDayTime, endDayTime, event, testedDates) {
	let calendarID = store.getState().CalendarReducer.id;
	let obj = {};
	obj.timeZone = 'UTC';
	obj.items = [{'id': calendarID}];

	return new Promise( async function(resolve) {
		let available = false;
	
		while(!available) {
			let startDate = new Date(event.startDate);
			let endDate = new Date(event.endDate);
			let eventHours = event.hours;
			let eventMinutes = event.minutes; 

			// Check if it is a specific Date Range
			//
			if(event.specificDateRange == false) endDate.setDate(startDate.getDate() + 7);
			
			// Check if the total duration must be divided
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

			let randomEndTime = randomStartTime + eventHours;
			endDate.setHours(randomEndTime, eventMinutes);
			endDate.setDate(randomDay);
			endDate = endDate.toISOString();

			// If random generated startDate has already been tested, move to the next itteration
			if (testedDates.includes(`${startDate}${endDate}`)) continue;

			obj.timeMin = startDate;
			obj.timeMax = endDate;
			//console.log('obj', obj);
			// Call to google to check whether time conflicts with the specified generated startDate;
			await getAvailabilities(obj).then(data => {
				//console.log('data', data);
				let busySchedule = data.calendars[Object.keys(data.calendars)[0]].busy;
				if (busySchedule.length > 0) {
					console.log('slot already taken!');
					testedDates.push(`${startDate}${endDate}`);
					
				} else {
					console.log(`found a free slot! Pushing the event! ${randomStartTime}`);
					available = true;
					testedDates.push(`${startDate}${endDate}`);
					resolve({startDate, endDate});
				}
				console.log('testedDates', testedDates);
			});
		}
	});
}

/**
 *	pushes the non fixed event into redux store
 * 
 * @param {integer} availableDate {startDate, endDate} object found available in google Calendar
 * @param {Object} event state object of the event
 */
let storeNonFixedEvent = (availableDate, event) => {
	//let calendarID = store.getState().CalendarReducer.id;
	return new Promise( function(resolve) {
		let obj = {
			'end': {},
			'start': {}
		};

		obj.end.timeZone = 'UTC';
		obj.start.timeZone = 'UTC';
		obj.summary = event.title;
		obj.location = event.location;
		obj.description = event.description;
		obj.end.dateTime = availableDate.endDate;
		obj.start.dateTime = availableDate.startDate;
	
		store.dispatch(addGeneratedNonFixedEvent(obj));
		resolve();
	});
};
export const insertGeneratedEvent = async (event) => {
	let calendarID = store.getState().CalendarReducer.id;
	return await insertEvent(calendarID,event,{});	
};

/**
 *	Generates a random number between an interval of max and min
 * 
 * @param {integer} __min minimum bound of the interval
 * @param {integer} __max maximum bound of the interval
 */
function getRndInteger(__min, __max) {
	return Math.floor(Math.random() * (__max - __min) ) + __min;
}

/**
 *	Divides the duration by the number of occurences
 * 
 * @param {integer} __hours hours of duration
 * @param {integer} __minutes minutes of duration
 * @param {integer} __occurence number of occurences
 */
function divideDuration(__hours, __minutes, __occurence) {
	let totalDuration = (__hours * 60) + __minutes;
	let dividedDuration = totalDuration / __occurence;
	let { hours, minutes } = convertMintuesToHours(dividedDuration);
	
	return {hours, minutes};
}

/**
 * Helper method to convert total minutes into hours and minutes
 * 
 * @param {integer} __duratrion total duration in minutes
 */
function convertMintuesToHours(__duration) { 
	const hours = Math.floor(__duration / 60);  
	const minutes = __duration % 60;

	return {hours, minutes};         
}