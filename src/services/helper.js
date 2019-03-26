import { clearCourse, clearCalendarID, clearFixedEvents, clearNonFixedEvents, clearGeneratedNonFixedEvents, clearGeneratedCalendars, clearNavigation, clearSchedule, clearSchoolInformation, clearState, clearUnavailableHours, logoffUser } from '../actions';
import { store } from '../store';

export const convertToDictionary  = (data) => {
	let dict = {};
	data.forEach(item => {
		if(dict[item.position.x] != undefined) {
			dict[item.position.x].push(item);
		} else {
			dict[item.position.x] = [item];
		}
	});
	return dict; 
};

export const formatData = (data) => {
	let dict = convertToDictionary(data);
	let events = [];
	for (const [key,value] of Object.entries(dict)) {
		console.log(key,'key');
		if(value.length > 1) {
			let event = {
				courses: []
			};
			value.forEach(item => {
				// Case where there array indicates a day not course
				if((item.courseInfo.length <= 2)) {
					event.day = item.courseInfo[0];
				} else {
					// Check for trashy case: Refine this!!
					// This is where the array size is 5, it breaks the algorithm
					// Thus turning the array back to size 4 by removing broken data 
					if(item.courseInfo.length > 4) {
						let brokenData = item.courseInfo[1];
						item.courseInfo[0] += brokenData;
						item.courseInfo.splice(1, 1);
					}
					let obj = {
						name: item.courseInfo[0],
						time: item.courseInfo[2],
						location: item.courseInfo[3]
					};
					event.courses.push(obj);
				}
			});
			events.push(event);
		}
	}
	return new Promise( function(resolve, reject) {
		if(events.length == 0) {
			reject('Something went wrong while formating data (Array length == 0)');
		} else {
			resolve(events);
		}
	});
};

/**
 * Helper method to get the startDate of a particular course
 * 
 * @param {Date} date Start Date of the semester
 * @param {String} tempDay The day the course is being held on
 */
export const getStartDate = (date, tempDay) => {
	let semesterStart = new Date(date.getTime());
	let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
	let day = days.indexOf(tempDay) + 1;
	// Convert time to EST
	semesterStart.setTime(semesterStart.getTime()+semesterStart.getTimezoneOffset()*60*1000);
	let startDay = semesterStart.getDay();

	if(day < startDay) {
		let diff = startDay - day;
		semesterStart.setDate(semesterStart.getDate() + (7 - diff));
	} else if (day > startDay) {
		let diff = day - startDay;
		semesterStart.setDate(semesterStart.getDate() + diff);
	}

	let newDate =  new Date(semesterStart.getTime());
	return newDate;
};


/**
 * Check if a date is within the array of Dates
 * 
 * @param {array} dates array of dates
 * @param {Date} checkDate date to be checked
 */
export function containsDateTime(dates, checkDate) {
	let checkStartDate = checkDate.startDate;
	let checkEndDate = checkDate.endDate;
	let contains = false;
	dates.forEach(date => {
		let startDate = new Date(date.startDate);
		let endDate = new Date(date.endDate);

		if((checkStartDate >= startDate && checkStartDate <= endDate ) || (checkEndDate >= startDate && checkEndDate <= endDate)) {
			contains = true;
			return contains;
		}  
	});
	return contains;
}

/**
 *	Generates a random number between an interval of max and min
 * 
 * @param {integer} __min minimum bound of the interval
 * @param {integer} __max maximum bound of the interval
 */
export function getRndInteger(__min, __max) {
	return Math.round(Math.random() * (__max - __min) ) + __min;
}

/**
 *	Divides the duration by the number of occurences
 * 
 * @param {integer} __hours hours of duration
 * @param {integer} __minutes minutes of duration
 * @param {integer} __occurence number of occurences
 */
export function divideDuration(__hours, __minutes, __occurence) {
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

export const clearEveryReducer = () => {
	const reducersDeleteActions = [
		clearCourse,
		clearCalendarID,
		clearFixedEvents,
		clearNonFixedEvents,
		clearGeneratedNonFixedEvents,
		clearGeneratedCalendars,
		clearNavigation,
		clearSchedule,
		clearSchoolInformation,
		clearState,
		clearUnavailableHours,
		logoffUser
	];

	reducersDeleteActions.map(action => store.dispatch(action()));

	console.log(store.getState());
};