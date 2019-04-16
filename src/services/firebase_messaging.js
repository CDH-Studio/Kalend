let server  =  'http://172.17.73.9:8080/';

let apiHelperCall = (URL, method, data) => {

	let fetchData = {
		method,
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	};

	if( method == 'POST') fetchData.body = JSON.stringify(data);

	return fetch(URL, fetchData);
};


export const requestCalendarPermissions = (info) => {
	return apiHelperCall(server + 'api/setCalendarAccess','POST', info);
};