import { Component } from "react";
const axios = require("axios");

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
