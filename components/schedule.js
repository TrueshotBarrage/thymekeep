import { Component } from "react";
import styles from "./schedule.module.css"
import utilStyles from "../styles/utils.module.css"

/**
 * TimeSlot is a component for each slot of a schedule.
 */
class TimeSlot extends Component {
  timeslotClicked(time) {
    alert(`Timeslot ${time} was clicked!`);
  }

  render() {
    const time = this.props.time;
    // We will use getDay() later for absolute dates & such
    const day = this.props.day;

    return (
      <div
        className={styles.timeslot}
        onClick={() => this.timeslotClicked(time)}
      >
        D{day}, H{time}
      </div>
    );
  }
}

/**
 * Schedule is the top-level schedule component. It displays an interactive 
 * schedule based on the user's availabilities.
 */
class Schedule extends Component {
  renderDay(i, hours, days) {
    const schedule = [];
    for (let j = 1; j <= hours; j++) {
      schedule.push(<TimeSlot key={`${i},${j}`} day={i} time={j} />);
    }

    return (
      <div className={styles.time} style={{ flexBasis: `${100 / days}%` }}>
        {schedule}
      </div>
    )
  }

  render() {
    // Hardcoded for now as an example
    const days = 4;
    const hours = 12;
    const schedule = [];

    for (let i = 0; i < days; i++) {
      schedule.push(this.renderDay(i, hours, days));
    }

    return (
      <div className={styles.day}>
        {schedule}
      </div>
    );
  }
}

export default Schedule;