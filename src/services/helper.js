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
		if(value.length > 1) {
			let event = {
				courses: []
			};
			value.forEach(item => {
				if((item.courseInfo.length == 1)) {
					event.day = item.courseInfo[0];
				} else {
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
 * Helper method to extract the startTime and endTime of a course from a string
 *
 * @param {String} time course time eg format '11:25 am : 12:55 pm'
 */
export const convertTimeToGoogle = (time) => {
	let arr = time.split(' ');
	let finalTime;
	if(arr[1] == 'pm') {
		let tempTime  = arr[0].split(':');
		let hours = parseInt(tempTime[0]);
		if( hours != 12) hours += 12;
		hours = hours.toString();
		let minutes = tempTime[1];
		finalTime = `${hours}:${minutes}:00`;
	} else if( arr[1] == 'am') {
		finalTime = `${arr[0]}:00`;
	}

	return finalTime;
};

/**
 * Helper method to get the startDate of a particular course
 * 
 * @param {Date} date Start Date of the semester
 * @param {String} tempDay The day the course is being held on
 */
export const getStartDate = (date, tempDay) => {
	let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
	let day = days.indexOf(tempDay) + 1;
	// Convert time to EST
	date.setTime(date.getTime()+date.getTimezoneOffset()*60*1000);
	let startDay = date.getDay();

	if(day < startDay) {
		let diff = startDay - day;
		date.setDate(date.getDate() + (7 - diff));
	} else if (day > startDay) {
		let diff = day - startDay;
		date.setDate(date.getDate() + diff);
	}

	let newDate =  new Date(date.getTime());
	return newDate;
};