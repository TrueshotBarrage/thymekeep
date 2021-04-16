// Imports
const axios = require("axios");

// Make a general GET request to the Google API.
async function get(accessToken, route) {
  try {
    const resp = await axios.get(route, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return resp;
  } catch (err) {
    return err.response.data;
  }
}

// Make a general POST request to the Google API. TODO: Needs work
async function post(accessToken, route, data) {
  try {
    const resp = await axios.post(route, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return resp;
  } catch (err) {
    return err.response.data;
  }
}

// Retrieve a user's info.
export async function getUserInfo(accessToken) {
  const userInfo = await get(
    accessToken,
    "https://www.googleapis.com/oauth2/v1/userinfo"
  );
  return userInfo;
}

// Get a list of the user's calendars.
export async function getCalendarList(accessToken) {
  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = "/users/me/calendarList";
  const calendarList = await get(accessToken, `${baseURL}${calendarURL}`);
  return calendarList;
}

// Get data about a specific calendar.
export async function getCalendar(accessToken, calendarID) {
  calendarID = encodeURIComponent(calendarID);
  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = `/users/me/calendarList/${calendarID}`;
  const calendar = await get(accessToken, `${baseURL}${calendarURL}`);
  return calendar;
}

// Get a list of events from a specific calendar.
export async function getEvents(
  accessToken,
  calendarID,
  pageToken,
  timeMin,
  timeMax
) {
  calendarID = encodeURIComponent(calendarID);

  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = `/calendars/${calendarID}/events`;

  const params = new URLSearchParams();
  if (pageToken) {
    params.append("pageToken", pageToken);
  }
  if (timeMin) {
    params.append("timeMin", timeMin);
  }
  if (timeMax) {
    params.append("timeMax", timeMax);
  }
  const paramsString = params.toString();
  const paramsURL = paramsString ? `?${paramsString}` : "";

  const events = await get(accessToken, `${baseURL}${calendarURL}${paramsURL}`);
  return events;
}

// Get data about a specific event from a specific calendar.
export async function getEvent(accessToken, calendarID, eventID) {
  calendarID = encodeURIComponent(calendarID);
  eventID = encodeURIComponent(eventID);

  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = `/calendars/${calendarID}/events/${eventID}`;

  const event = await get(accessToken, `${baseURL}${calendarURL}`);
  return event;
}

// Post a quick event in a calendar based on text entry.
export async function postQuickEvent(accessToken, calendarID, text) {
  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = `/users/me/calendarList/${calendarID}/events/quickAdd`;
  const event = await post(accessToken, `${baseURL}${calendarURL}`, text);
  return event;
}
