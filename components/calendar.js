import { Component } from "react";
const axios = require("axios");

const days_of_week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const days_of_week_short = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

const months = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 30,
};

const months_short = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getDaysInMonth(m, y) {
  if (m == 2 && isLeapYear(y)) {
    return 29;
  } else {
    return months.get(m - 1);
  }
}

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      isLoaded: false,
      calendars: null,
    };
  }

  componentDidMount() {
    // Get the user's calendars when component mounts
    axios.get("/api/get/calendars").then(
      (res) => {
        this.setState({
          isLoaded: true,
          calendars: res.data,
        });
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
      }
    );
  }

  render() {
    const { error, isLoaded, calendars } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    // Map each calendar to a bulleted list item (for now, ofc not permament)
    return (
      <ul>
        {calendars.items.map((calendar) => (
          <li key={calendar.id}>{calendar.summary}</li>
        ))}
      </ul>
    );
  }
}

export default Calendar;
