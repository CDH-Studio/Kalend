import { formatData, getStartDate, containsDateTime, divideDuration, getRndInteger, convertEventsToDictionary, selectionSort } from './helper';
import { insertEvent, getCalendarList, createSecondaryCalendar, getAvailabilities, listEvents } from './google_calendar';
import { googleGetCurrentUserInfo } from './google_identity';
import { store } from '../store';
import { addGeneratedNonFixedEvent, addCourse, addGeneratedCalendar, clearGeneratedNonFixedEvents, logonUser } from '../actions';
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

/* 
 * Sets User Info in the user reducer
 */
export const  setUserInfo = async () => {
	let userInfo = await googleGetCurrentUserInfo();
	store.dispatch(logonUser(userInfo));
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
				if (res) {
					return res.json();
				} else {
					reject('Could not receive response from the server, please try again');
				}
			})
			
			.then(body => {
				if(body.data.length == 0) reject('The data from your schedule could not be extracted, please try again');
				formatData(body.data)
					.then(data => {
						storeCoursesEvents(data)
							.then((success) => {
								if(success) return resolve(true);
								else return reject(false);
							});
					})
					.catch(err => {
						reject(err);
					});
			})
			.catch(err => {
				if(err) reject('Could not connect to the server, please try again later');
			});
	});
};

/*=============================================== COURSE EVENTS SERVICES START ============================================================*/ 

/**
 *	Format all Course Events and Store them in redux store
 * 
 * @param {Array} events an array of all courses events 
 */
export const storeCoursesEvents = (events) => {
	let schoolInfo =  store.getState().SchoolInformationReducer.info.info;
	let semesterStartDate = new Date(schoolInfo.startDate);
	let tempEnd =  new Date(schoolInfo.endDate);
	let semesterEndDate  = tempEnd.toISOString().split('T')[0].replace(/-/g, ''); 

	let recurrence = [
		`RRULE:FREQ=WEEKLY;UNTIL=${semesterEndDate}`
	];

	return new Promise( function(resolve) {
		events.forEach( event => {
			event.courses.forEach(course => {
				// console.log('course', course);
				let obj = {
					'end': {},
					'start': {}
				};

				// Course StartDate and End Date for a specific Day
				// They are both the same because it starts and ends on the same day, the only difference is hours
				let courseStartDate = getStartDate(semesterStartDate, event.day);
				let courseEndDate = getStartDate(semesterStartDate, event.day);
	
				
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
				courseStartDate.setHours((d[0][2] === 'pm'  && parseInt(d[0][0]) !== 12 ? 12 : 0) + parseInt(d[0][0]), parseInt(d[0][1]), 0);
				courseEndDate.setHours((d[1][2] === 'pm' && parseInt(d[1][0]) !== 12 ? 12 : 0) + parseInt(d[1][0]), parseInt(d[1][1]), 0);

				
				obj.end.dateTime = courseEndDate.toJSON();
				obj.start.dateTime = courseStartDate.toJSON();
				obj.start.timeZone = 'America/Toronto';
				obj.end.timeZone = 'America/Toronto';
				
				obj.summary = course.name;
				obj.location = course.location;
				obj.recurrence = recurrence;
				
				let courseReduxObj = obj;
				courseReduxObj.dayOfWeek = event.day;
				courseReduxObj.hours = d;

				store.dispatch(addCourse(courseReduxObj));	
			});
		});
		resolve(true);
	});
};

/**
 *	Takes a course event and insert's it into Google Calendar
 * 
 * @param {Array} event a course event object
 */
export const InsertCourseEventToCalendar = (event) => {
	let calendarID = store.getState().CalendarReducer.id;

	let obj = {};

	obj.end = event.end;
	obj.start = event.start;
	obj.recurrence = event.recurrence;
	obj.location = event.location;
	obj.description = event.description;
	obj.summary = event.summary;

	return insertEvent(calendarID, obj,{});	
};


/*===============================================FIXED EVENTS ============================================================*/ 

/**
 *	Insert's fixed Event into the Google Calendar
 * 
 * @param {Object} event state object of the event
 */
export const  InsertFixedEventToCalendar = (event) => {
	let calendarID = store.getState().CalendarReducer.id;
	let obj = { 
		'end': {},
		'start': {}
	};

	if(event.recurrence != 'NONE') {
		let recurrence = [
			`RRULE:FREQ=${event.recurrence};`
		];
		obj.recurrence = recurrence;
		obj.start.timeZone = 'America/Toronto';
		obj.end.timeZone = 'America/Toronto';
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

/*===============================================CALENDAR INFO SERVICES ============================================================*/ 

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
 *	Converts All events into SCHEDULESELECTION screen readable 
 */
export const eventsToScheduleSelectionData = () => {
	let data = {
		fixedEvents: [],
		schoolEvents: [],
		aiCalendars:[],
		school: [],
		fixed: [],
		ai: []
	};
	data.schoolEvents = store.getState().CoursesReducer;
	data.fixedEvents = store.getState().FixedEventsReducer;
	data.aiCalendars = store.getState().GeneratedCalendarsReducer;

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

		data.aiCalendars.forEach( (calendar, index)  => {
			data.ai[index] = [];
			calendar.forEach( (event) => {
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
				data.ai[index].push(obj);
			});
		});
		resolve(data);
	});
};

/*===============================================NON FIXED EVENTS ============================================================*/ 

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

/**
 *	Itterates over the number of Occurences
 * 
 * @param {Object} event state object of the event
 */
async function ItterateOccurence(event) {
	let pushedDates = [];
	let startDayTime = 8;
	let endDayTime = 22;
	let promises = [];

	for (let i = 0; i < event.occurrence; i++) {
	
		await findEmptySlots(startDayTime, endDayTime, event, pushedDates).then(availableDate => {
			pushedDates.push(availableDate);
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
 * @param {Array} pushedDates Array of dates where the slots are not available
 */
function findEmptySlots(startDayTime, endDayTime, event, pushedDates) {
	let calendarID = store.getState().CalendarReducer.id;
	let obj = {};
	
	obj.items = [{'id': calendarID}];
	return new Promise( async function(resolve, reject) {
		let available = false;
		let eventStartDate = new Date();
		let eventEndDate = new Date();
		let eventHours = event.hours;
		let eventMinutes = event.minutes;

		
		// If not a specific Date Range then make it a week range
		if(event.specificDateRange == false) {
			eventEndDate.setDate(eventStartDate.getDate() + 7);

		}  else {
			eventStartDate = new Date(event.startDate);
			eventEndDate = new Date(event.endDate);
		}
			
		// Check if the total duration must be divided
		if (event.isDividable) {
			let dividedDuration = divideDuration(event.hours, event.minutes, event.occurrence);
	
			eventHours = dividedDuration.hours;
			eventMinutes = dividedDuration.minutes;
		} 
		
		while(!available) {
			let randomStartTime = getRndInteger(startDayTime, endDayTime - eventHours);
			let randomStartTimeMinutes = getRndInteger(0, 60);
			let startDate = getRandomDate(eventStartDate.getTime(), eventEndDate.getTime());
			let endDate = new Date(startDate);
		

			startDate.setHours(randomStartTime, randomStartTimeMinutes);
			endDate.setTime(startDate.getTime() + (eventHours * 60000 * 60) + (eventMinutes * 60000));

			// If the random generated Date is has already been tested, skip the itteration
			if(containsDateTime(pushedDates, {startDate, endDate})) continue;
			
			let startDateISO = startDate.toISOString();
			let endDateISO = endDate.toISOString();

			obj.timeMin = startDateISO;
			obj.timeMax = endDateISO;
	
			// Call to google to check whether time conflicts with the specified generated startDate;
			await getAvailabilities(obj).then(data => {
				if(data.error) reject('Something went wrong while checking for events in Google Calendar');
				
				let busySchedule = data.calendars[Object.keys(data.calendars)[0]].busy;
				if (busySchedule.length > 0) {
					pushedDates.push({startDate,endDate});
				} else {
					available = true;
					pushedDates.push({startDate,endDate});
					resolve({startDate, endDate});
				}
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

		if (event.isRecurrent) {
			obj.recurrence = ['RRULE:FREQ=WEEKLY;'];
			obj.start.timeZone = 'America/Toronto';
			obj.end.timeZone = 'America/Toronto';
		}

		obj.summary = event.title;
		obj.location = event.location;
		obj.description = event.description;
		obj.end.dateTime = availableDate.endDate;
		obj.start.dateTime = availableDate.startDate;
	
		store.dispatch(addGeneratedNonFixedEvent(obj));
		resolve();
	});
};


/*===============================================GENERATED EVENTS ============================================================*/ 

export const insertGeneratedEvent = async (event) => {
	let calendarID = store.getState().CalendarReducer.id;
	return await insertEvent(calendarID,event,{});	
};

export const generateCalendars = async () => {
	let numberOfCalendars = 3;
	let promises = [];
	
	for(let i = 0; i < numberOfCalendars; i ++) {
		await generateNonFixedEvents().then((dataPromises) => {
			// Store the Generated Non Fixed Events for i-th itteration in GeneratedCalendars
			store.dispatch(addGeneratedCalendar(store.getState().GeneratedNonFixedEventsReducer));
			// CLear Generated Non Fixed Events
			store.dispatch(clearGeneratedNonFixedEvents());
			promises.push(dataPromises);
		});
	}

	return Promise.all(promises);
};

export const getDataforDashboard = async () => {
	let calendarID = store.getState().CalendarReducer.id;
	return new Promise(async (resolve, reject) => {
		await listEvents(calendarID).then(data => {
			if (data.error) reject('There was a problem featching your data');
			convertEventsToDictionary(data.items).then(dict => {
				if(dict == undefined) reject('There was an error in converting data to dict');
				resolve(dict);
			});
		});
	});
};

export const sortEventsInDictonary = (dict) => {
	for (let [key,value] of Object.entries(dict)) {
		let sortedValue = selectionSort(value);
		dict[key] = sortedValue;
	}
	return dict;
};

export const insertFixedEventsToGoogle = async () => {
	let promises = [];

	await store.getState().CoursesReducer.forEach(async (event) => {
		promises.push(new Promise(function(resolve,reject) {
			InsertCourseEventToCalendar(event).then(data => {
				if(data.error) reject('There was a problem inserting Course');
				resolve(data);
			});
		}));
	});

	await store.getState().FixedEventsReducer.map(async (event) => {
		let info = {
			title: event.title,
			location: event.location,
			description: event.description,
			recurrence: event.recurrence,
			allDay: event.allDay,
			startDate: event.startDate,
			startTime: event.startTime,
			endDate: event.endDate,
			endTime: event.endTime
		}; 
		
		promises.push(new Promise(function(resolve,reject) {
			InsertFixedEventToCalendar(info).then(data => {
				if (data.error)  reject('There was a problem inserting Fixed Event');
				resolve(data);
			});
		}));
	});

	return Promise.all(promises);
};
