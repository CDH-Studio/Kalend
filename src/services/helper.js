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
	for (const [key, value] of Object.entries(dict)) {
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
						time: item.courseInfo[2].split('-'),
						location: item.courseInfo[3]
					};
					event.courses.push(obj);
				}
			});
			events.push(event);
		}
	}
	return events;
};