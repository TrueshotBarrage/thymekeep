import React, { Component } from "react";
const axios = require("axios");

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      isLoaded: false,
      calendars: null,
      events: null,
    };
  }

  findWeekBoundaries() {
    // Set boundary times for this week
    const now = new Date();
    const firstDay = now.getDate() - now.getDay();

    // Logic to find this past Sunday & this Saturday
    const thisSunday = new Date(now.setDate(firstDay));
    const thisSaturday = new Date(now.setDate(firstDay + 6));

    // Set the times to be as extensive as possible (12:00AM ~ 11:59PM)
    thisSunday.setHours(0, 0, 0, 0);
    thisSaturday.setHours(23, 59, 59, 999);

    // We just want the string representations for our query params
    return [thisSunday.toISOString(), thisSaturday.toISOString()];
  }

  getCalendars() {
    return axios.get("/api/get/calendars").then(
      (res) => {
        this.setState({
          calendars: res.data,
        });
        return res;
      },
      // Different types of errors should be handled differently
      (err) => {
        if (err.response) {
          this.setState({
            isLoaded: true,
            error: `${err.response.status} ${err.response.statusText}`,
          });
        } else if (err.request) {
          this.setState({
            isLoaded: true,
            error: `${err.request.status} ${err.request.statusText}`,
          });
        } else {
          this.setState({
            isLoaded: true,
            error: err.message,
          });
        }
        return err;
      }
    );
  }

  getEvents(cid, timeMin, timeMax, pageToken) {
    // Encode our URL components to guarantee they can be parsed correctly
    const uriEncodedCID = encodeURIComponent(cid);

    // Set the route correctly (if query string parameters exist, we should
    // include them as part of our URL for our GET request)
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
    const route = `/api/get/calendars/${uriEncodedCID}/events${paramsURL}`;

    // Send the GET request to our API
    return axios.get(route).then(
      (res) => {
        // Check if this is our first data item or we have a couple already
        if (!this.state.events) {
          this.setState({
            events: res.data.items,
          });
        } else {
          this.setState({
            events: [...this.state.events, ...res.data.items],
          });
        }
        // Do we have more pages to load? Then recursively request again.
        if (res.data.nextPageToken) {
          return this.getEvents(cid, timeMin, timeMax, res.data.nextPageToken);
        } else {
          this.setState({
            isLoaded: true,
          });
          return res;
        }
      },
      // Different types of errors should be handled differently
      (err) => {
        if (err.response) {
          this.setState({
            isLoaded: true,
            error: `${err.response.status} ${err.response.statusText}`,
          });
        } else if (err.request) {
          this.setState({
            isLoaded: true,
            error: `${err.request.status} ${err.request.statusText}`,
          });
        } else {
          this.setState({
            isLoaded: true,
            error: err.message,
          });
        }

        return err;
      }
    );
  }

  componentDidMount() {
    // Find this week's Sunday ~ Saturday bounds as Date objects
    const [timeMin, timeMax] = this.findWeekBoundaries();

    // Get the user's calendars when component mounts
    this.getCalendars()
      // Then get the events for each calendar owned by user
      .then((_) => {
        const ownedCalendars = this.state.calendars.items.filter(
          (calendar) => calendar.accessRole === "owner"
        );

        // Some fancy promise chaining magic
        let p = this.getEvents(ownedCalendars[0].id, timeMin, timeMax);
        for (let i = 1; i < ownedCalendars.length; i++) {
          p = p.then(this.getEvents(ownedCalendars[i].id, timeMin, timeMax));
        }
        return p;
      });
  }

  render() {
    const { error, isLoaded, calendars, events } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    // Map each event to a bulleted list item (for now, ofc not permament)
    return (
      <ol>
        {events.map((evt) =>
          evt.status === "confirmed" && evt.start.dateTime ? (
            <li
              key={evt.id}
            >{`${evt.summary} - ${evt.start.dateTime} ~ ${evt.end.dateTime}`}</li>
          ) : (
            <React.Fragment key={evt.id}></React.Fragment>
          )
        )}
      </ol>
    );
  }
}

export default Event;
