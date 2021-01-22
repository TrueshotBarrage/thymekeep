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
    return (
      <div
        className={styles.timeslot}
        onClick={() => this.timeslotClicked(time)}
      >
        {time} AM
      </div>
    );
  }
}

/**
 * Schedule is the top-level schedule component. It displays an interactive 
 * schedule based on the user's availabilities.
 */
export default function Schedule() {
  // Hardcoded for now as an example
  const schedule = [];
  for (let i = 1; i <= 12; i++) {
    schedule.push(<TimeSlot time={i} />);
  }

  return (
    <div>
      {schedule}
    </div>
  );
}
