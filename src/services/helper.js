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