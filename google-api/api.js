// Imports
const axios = require("axios");

function getAuthTokens(authCode) {
  const tokenPost = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    grant_type: "authorization_code",
    code: authCode,
  };

  // Make POST request to Google's servers to get access & refresh tokens
  const resp = (async () => {
    try {
      const tokenResp = await axios.post(
        "https://oauth2.googleapis.com/token",
        tokenPost
      );
      return tokenResp;
    } catch (err) {
      return err.response.data;
    }
  })();

  return resp;
}

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
async function getUserInfo(accessToken) {
  const userInfo = await get(
    accessToken,
    "https://www.googleapis.com/oauth2/v1/userinfo"
  );
  return userInfo;
}

// Get a list of the user's calendars.
async function getCalendarList(accessToken) {
  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = "/users/me/calendarList";
  const calendarList = await get(accessToken, `${baseURL}${calendarURL}`);
  return calendarList;
}

// Get a specific calendar.
async function getCalendar(accessToken, calendarID) {
  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = `/users/me/calendarList/${calendarID}`;
  const calendar = await get(accessToken, `${baseURL}${calendarURL}`);
  return calendar;
}

// Post a quick event in a calendar based on text entry.
async function postQuickEvent(accessToken, calendarID, text) {
  const baseURL = "https://www.googleapis.com/calendar/v3";
  const calendarURL = `/users/me/calendarList/${calendarID}/events/quickAdd`;
  const event = await post(accessToken, `${baseURL}${calendarURL}`, text);
  return event;
}

export {
  getAuthTokens,
  getUserInfo,
  getCalendarList,
  getCalendar,
  postQuickEvent,
};
