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

export const storeUserInfoService = (info) => {
	return apiHelperCall(server + 'api/logUser','POST', info);
};

export const getUserInfoService = () => {
	return apiHelperCall(server + 'api/getUserInfo','GET');
};

export const getUserValuesService = (info) => {
	return apiHelperCall(server + 'api/getUserValues','POST', info);
};

export const updateUser = (info) => {
	return apiHelperCall(server + 'api/updateUser','POST', info);
};

export const storeSchoolInfoService = (info) => {
	return apiHelperCall(server + 'api/storeSchoolInfo','POST', info);
};

export const getSchoolInfoService = () => {
	return apiHelperCall(server + 'api/getSchoolInfo','GET');
};

export const storeUserHours = (info) => {
	return apiHelperCall(server + 'api/storeUserHours', 'POST', info);
};

export const getUserHours = () => {
	return apiHelperCall(server + 'api/storeUserHours', 'GET');
};

export const storeGeneratedCalendars = (info) => {
	return apiHelperCall(server + 'api/storeGeneratedCalendars', 'POST', info);
};

export const getEvents = () => {
	return apiHelperCall(server + 'api/getEvents', 'GET');
};

export const logOutUser = () => {
	return apiHelperCall(server + 'api/logOut', 'GET');
};