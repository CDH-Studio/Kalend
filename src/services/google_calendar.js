import { getUserValuesService  } from './api/storage_services';

/**
 * Helper method for the Google Calendar API calls
 * 
 * @param {String} URL The URL used for fetch
 * @param {String} method The fetch method (ex.: POST, GET, UPDATE, DELETE, PUT, ...)
 * @param {Object} body The body of the call
 * @param {Object} query Query parameter object to be appended to the URL
 */

	
let apiHelperCall = async (URL, method, body, query) => {
	let tokenData = await getUserValuesService({columns:['ACCESSTOKEN']}).then(res => res.json());
	let accessToken = tokenData.ACCESSTOKEN;

	let fetchData = {
		method,
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + accessToken,
			'Content-Type': 'application/json',
		}
	};

	if (method !== 'GET' && method !== 'HEAD') {
		fetchData.body = JSON.stringify(body);
	}

	let queryText = '';
	if (query !== undefined) {
		queryText = getQueryParam(query);
	}

	return fetch(URL + queryText, fetchData)
		.then((response) => {
			if (response.status === 204) {
				return {};
			}
			if (response._bodyText === '') {
				return response;
			}
			return response.json();
		})
		.catch((error) => console.error(error));
};

/**
 * Returns a string that is appendable to a URL
 * 
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {String} A parameter string to be appended to a URL
 */
let getQueryParam = (query) => {
	let text = '?';
	let keys = Object.keys(query);

	for (let i = 0; i < keys.length; i++) {
		text += keys[i] + '=' + query[keys[i]] + '&';
	}

	return text.substr(0, text.length-1);
};

/**
 * Returns a list of calendar
 * https://developers.google.com/calendar/v3/reference/calendarList/list
 * 
 * @returns {Promise} A promise containing an object with all the calendars for the specified account
 */
let getCalendarList = () => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/users/me/calendarList/', 'GET');
};

/**
 * Creates a new secondary calendar
 * https://developers.google.com/calendar/v3/reference/calendars/insert
 * 
 * @param {Object} data The JSON object containing the information needed for the API
 * @param {String} data.summary The name of the calendar
 * 
 * @returns {Promise} A promise containing an object with the information about the newly created calendar
 */
let createSecondaryCalendar = (data) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars', 'POST', data);
};

/**
 * Returns the availabilities of multiple calendars
 * https://developers.google.com/calendar/v3/reference/freebusy/query
 * 
 * @param {Object} data The JSON object containing the information needed for the API
 * @param {DateTime} data.timeMin The start of the interval for the query formatted RFC3339
 * @param {DateTime} data.timeMax The end of the interval for the query formatted RFC3339
 * @param {List} data.items[] List of objects containing the id of calendars to compare
 * @param {String} data.items[].id The calendar identifier
 * 
 * @returns {Promise} A promise containing an object with the availabilities for all the specified accounts
 */
let getAvailabilities = (data) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/freeBusy', 'POST', data);
};

/**
 * Returns the colors available for the user
 * https://developers.google.com/calendar/v3/reference/colors/get
 * 
 * @returns {Promise} A promise conatining an object with all the possible calendar and event colors in a HEX format
 */
let getColors = () => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/colors', 'GET');
};

/**
 * Returns the permissions for a specified calendar
 * https://developers.google.com/calendar/v3/reference/acl/list
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information of everyone who has access to the specified calendar
 */
let getAccessRules = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/acl', 'GET', data, query);
};

/**
 * Adds someone to the permission list for a specified calendar
 * https://developers.google.com/calendar/v3/reference/acl/insert
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {String} data.role The role for the scope (none, freeBusyReader, reader, writer, owner)
 * @param {Object} data.scope The scope of the rule
 * @param {String} data.scope.type The type of permission (default, user, group, domain)
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information about the current access rule added
 */
let insertAccessRule = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/acl', 'POST', data, query);
};

/**
 * Removes someone from your list of permissions for a specified calendar
 * https://developers.google.com/calendar/v3/reference/acl/delete
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} ruleId The ACL rule identifier
 * 
 * @returns {Promise} A promise containing an empty object if successful
 */
let removeAccessRules = (calendarId, ruleId) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/acl/' + ruleId, 'DELETE');
};

/**
 * Deletes an event from the specified calendar and event
 * https://developers.google.com/calendar/v3/reference/events/delete
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} eventId The event identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Response} The fetch response (will not return an object)
 */
let deleteEvent = (calendarId, eventId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId, 'DELETE', data, query);
};

/**
 * Returns infomration about an event
 * https://developers.google.com/calendar/v3/reference/events/get
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} eventId The event identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information of the specified event in the specified calendar
 */
let getEvent = (calendarId, eventId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId, 'GET', data, query);
};

/**
 * Creates an event
 * https://developers.google.com/calendar/v3/reference/events/insert
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} data.end The end time of the event
 * @param {Object} data.start The start time of the event
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with more information about the created event, like the event id
 */
let insertEvent = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events', 'POST', data, query);
};

/**
 * Returns a list of events for the specified calendar
 * https://developers.google.com/calendar/v3/reference/events/list
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information of every events in the specified calendar
 */
let listEvents = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events', 'GET', data, query);
};

/**
 * Creates an event according to the text input given (with Natural language processing)
 * https://developers.google.com/calendar/v3/reference/events/quickAdd
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the event's information that has been created
 */
let addQuickEvent = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/quickAdd', 'POST', data, query);
};

/**
 * Returns all the instances of the recurring event specified
 * https://developers.google.com/calendar/v3/reference/events/instances
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} eventId The event identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with all of the recurrent events
 */
let getEventsInstances = (calendarId, eventId, data, query) => {
	return  new Promise(resolve => {
		resolve(apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId + '/instances', 'GET', data, query));
	});
};

/**
 * Updates the information of an event with the specified attributes
 * https://developers.google.com/calendar/v3/reference/events/patch
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} eventId The event identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information of the newly modified event
 */
let updateEvent = (calendarId, eventId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId, 'PATCH', data, query);
};

/**
 * Replaces the information of an event
 * https://developers.google.com/calendar/v3/reference/events/update
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} eventId The event identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} data.end The end time of the event
 * @param {Object} data.start The start time of the event
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with
 */
let replaceEvent = (calendarId, eventId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId, 'PUT', data, query);
};

/**
 * Returns information about the specified calendar
 * https://developers.google.com/calendar/v3/reference/calendarList/get
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object about the calendar
 */
let getCalendar = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/users/me/calendarList/' + calendarId, 'GET', data, query);
};

/**
 * Deletes the specified calendar
 * https://developers.google.com/calendar/v3/reference/calendarList/delete
 * 
 * @param {String} calendarId The calendar identifier
 * 
 * @returns {Promise} A promise containing an empty object if successful
 */
let deleteCalendar = (calendarId) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/users/me/calendarList/' + calendarId, 'DELETE');
};

/**
 * Updates the information of an event with the specified attributes
 * https://developers.google.com/calendar/v3/reference/events/patch
 * 
 * @param {String} calendarId The calendar identifier
 * @param {String} eventId The event identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information of the newly modified event
 */
let updateCalendar = (calendarId, eventId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId, 'PATCH', data, query);
};

module.exports = { 
	createSecondaryCalendar, 
	getCalendarList, 
	getColors, 
	getAvailabilities, 
	getAccessRules, 
	insertAccessRule,
	deleteEvent,
	getEvent,
	insertEvent,
	listEvents,
	addQuickEvent,
	getEventsInstances,
	updateEvent,
	replaceEvent,
	getCalendar,
	removeAccessRules,
	deleteCalendar,
	updateCalendar
};
