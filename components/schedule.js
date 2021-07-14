import React, { Component } from "react";
import styles from "./schedule.module.css";
import utilStyles from "../styles/utils.module.css";
import ActiveLink from "../components/activeLink";
const axios = require("axios");

const name = "Dave";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Timeslot is a component for each slot of a schedule.
 */
class Timeslot extends Component {
  timeslotClicked(time) {
    alert(`Timeslot ${time} was clicked!`);
  }

  render() {
    const timeStart = this.props.timeStart;
    const slot = this.props.slot;
    // We will use getDay() later for absolute dates & such
    const day = this.props.day;

    const minsSinceMidnight = timeStart * 60 + slot * 30;
    let hour = Math.floor(minsSinceMidnight / 60);
    const isPM = hour >= 12;
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    const hourString = `${hour}`;
    const min = minsSinceMidnight % 60;
    // const minString = min.toLocaleString("en-US", {
    //   minimumIntegerDigits: 2,
    //   useGrouping: false,
    // });
    const time = `${hourString} ${isPM ? "PM" : "AM"}`;

    return min === 0 ? (
      <div
        className={styles.timeslot}
        onClick={() => this.timeslotClicked(slot)}
      >
        {/* {daysOfWeek[day % 7].substring(0, 3)}, T{slot} ({time}) */}
      </div>
    ) : (
      <div
        className={styles.timeslot30}
        onClick={() => this.timeslotClicked(slot)}
      >
        {/* {daysOfWeek[day % 7].substring(0, 3)}, T{slot} ({time}) */}
      </div>
    );
  }
}

/**
 * Schedule is the top-level schedule component. It displays an interactive
 * schedule based on the user's availabilities.
 */
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      isLoaded: false,
      calendars: null,
      events: null,
      timeMin: null,
      timeMax: null,
      slotEvents: null,
    };
    this.convertEventToTimeslot = this.convertEventToTimeslot.bind(this);
  }

  findWeekBoundaries() {
    // Set boundary times for this week
    const now = new Date();
    let firstDay = now.getDate() - now.getDay();

    // Logic to find this past Sunday & this Saturday
    const thisSunday = new Date(now.setDate(firstDay));
    const thisSaturday = new Date(now.setDate(thisSunday.getDate() + 6));

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
        if (this.state.events == null) {
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

  // Converts an Event item from the API to an object that contains information
  // about which timeslot it should belong to.
  // Precondition: The event should contain start.dateTime and end.dateTime
  // fields (i.e. has duration in times, not days)
  convertEventToTimeslot(event) {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    const timeMin = this.state.timeMin;

    // TODO: Replace hardcoded timeStart with state param
    const timeStart = 9;

    /*
     * day: which column the event belongs to
     * slot: which timeslot in a column it starts from
     * startOffset: percent offset from the slot that it starts from, e.g.
     * 45 mins -> 15/30 = 50%; 12 mins -> 12/30 = 40%
     * heightOffset: percent offset of the height of the event with respect
     * to the slot height, e.g. 70 mins -> 70/30 = 233%
     * eventName: the name of the event
     */
    const slotData = {
      day: eventStart.getDate() - timeMin.getDate(),
      slot:
        (eventStart.getHours() - timeStart) * 2 +
        Math.floor(eventStart.getMinutes() / 30),
      startOffset: (eventStart.getMinutes() % 30) / 30,
      heightOffset: (eventEnd - eventStart) / 1000 / 60 / 30,
      eventName: event.summary,
    };

    // If the range of dates crosses two months, we should add the number of
    // days in the first month to calculate the correct day of each event.
    if (slotData.day < 0) {
      const month = timeMin.getMonth();
      const year = timeMin.getFullYear();
      const numDaysInMonth = new Date(year, month + 1, 0).getDate();
      slotData.day = slotData.day + numDaysInMonth;
    }

    // If an event's time/duration overflows into the range of times available,
    // we should still display what is left.
    if (slotData.slot < 0) {
      slotData.heightOffset =
        slotData.slot + slotData.startOffset + slotData.heightOffset;
      slotData.slot = 0;
      slotData.startOffset = 0;
    }

    // If the new (or old) height of the slot event is not a valid height,
    // then discard the event.
    if (slotData.heightOffset <= 0) {
      return null;
    }

    return slotData;
  }

  componentDidMount() {
    // Find this week's Sunday ~ Saturday bounds as Date strings(!!)
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
          p = p.then((_) =>
            this.getEvents(ownedCalendars[i].id, timeMin, timeMax)
          );
        }
        return p;
      })
      .then((_) => {
        const filteredEvents = this.state.events.filter((evt) =>
          evt?.start.hasOwnProperty("dateTime")
        );
        const slotEvents = filteredEvents.map(this.convertEventToTimeslot);
        this.setState({
          slotEvents: slotEvents,
        });
      });

    this.setState({
      timeMin: new Date(timeMin),
      timeMax: new Date(timeMax),
    });
  }

  renderDay(day, hours, days, timeStart, slotsPerHour) {
    const schedule = [];

    const todaySlotEvents = this.state.slotEvents.filter(
      (evt) => evt?.day === day
    );

    let i = 0;
    for (let slot = 0; slot < hours * slotsPerHour; slot++) {
      const slotContainsEvent = slot === todaySlotEvents[i]?.slot;
      const eventComponent = slotContainsEvent ? (
        <div key={slot} className={styles.eventContainer}>
          <div
            key={slot}
            className={styles.event}
            style={{
              height: `${todaySlotEvents[i].heightOffset * 100}%`,
              top: `${todaySlotEvents[i].startOffset * 100}%`,
            }}
          >
            {todaySlotEvents[i].eventName}
          </div>
          <Timeslot
            key={`${day},${slot}`}
            timeStart={timeStart}
            day={day}
            slot={slot}
          />
        </div>
      ) : (
        <div key={slot} className={styles.eventContainer}>
          <Timeslot
            key={`${day},${slot}`}
            timeStart={timeStart}
            day={day}
            slot={slot}
          />
        </div>
      );
      schedule.push(eventComponent);
      if (slotContainsEvent) i++;
    }

    return (
      <div
        key={`day${day}`}
        className={styles.singleDay}
        style={{ flexBasis: `${100 / days}%` }}
      >
        {schedule}
      </div>
    );
  }

  createDayLabels(timeMin, timeMax) {
    const labels = [];
    const oneDay = 24 * 60 * 60 * 1000;
    const numDays = Math.round((timeMax - timeMin) / oneDay);

    let firstDay = new Date(timeMin);
    for (let i = 0; i < numDays; i++) {
      const today = new Date(firstDay);
      today.setDate(today.getDate() + i);
      const date = today.getDate();

      const label = (
        <div
          key={`day${date}`}
          className={styles.dayLabel}
          style={{ flexBasis: `${100 / numDays}%` }}
        >
          {`${daysOfWeek[today.getDay() % 7].substring(0, 3)} ${date}`}
        </div>
      );
      labels.push(label);
    }
    return labels;
  }

  createTimeLabels(startTime, numHours) {
    const labels = [];
    for (let i = 0; i < numHours; i++) {
      let hour = startTime + i;
      const isPM = hour >= 12;
      hour = hour % 12;
      hour = hour === 0 ? 12 : hour;
      const hourString = `${hour} ${isPM ? "PM" : "AM"}`;
      labels.push(
        <div key={hourString} className={styles.timeLabel}>
          {hourString}
        </div>
      );
    }
    return labels;
  }

  render() {
    const { timeMin, timeMax, slotEvents } = this.state;

    if (timeMin && timeMax && slotEvents) {
      const oneDay = 24 * 60 * 60 * 1000;
      const numDays = Math.round((timeMax - timeMin) / oneDay);
      const hours = 14; // For now, we have 14 hours in a day
      const slotsPerHour = 2; // For now, we have 2 slots per hour (30 min)
      const timeStart = 9; // For now, start at 9am hardcoded
      const schedule = [];

      const dayLabels = this.createDayLabels(timeMin, timeMax);

      const timeLabels = this.createTimeLabels(timeStart, hours);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      for (let i = 0; i < numDays; i++) {
        schedule.push(
          this.renderDay(i, hours, numDays, timeStart, slotsPerHour)
        );
      }

      return (
        <>
          <div className={styles.container}>
            <div className={styles.user}>
              <h1>Schedule for {name}</h1>
            </div>
            <div className={styles.tabs}>
              <ActiveLink href="/">Day</ActiveLink>
              <ActiveLink href="/">Week</ActiveLink>
              <ActiveLink href="/">Month</ActiveLink>
            </div>
            <div className={styles.schedule}>
              <div className={styles.leftColumn}>
                <div className={styles.timezone}>{timezone}</div>
                <div className={styles.timeLabels}>{timeLabels}</div>
              </div>
              <div className={styles.rightColumn}>
                <div className={styles.dayLabels}>{dayLabels}</div>
                <div className={styles.scheduleContainer}>
                  <div className={styles.weeklySchedule}>{schedule}</div>
                  <TimeslotSelectorZone
                    className={styles.timeslotSelectorZone}
                    numDays={numDays}
                    numSlotsPerDay={hours * slotsPerHour}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={styles.container}>
          <div className={styles.user}>
            <h1>Schedule for {name}</h1>
          </div>
          <div className={styles.tabs}>
            <ActiveLink href="/">Day</ActiveLink>
            <ActiveLink href="/">Week</ActiveLink>
            <ActiveLink href="/">Month</ActiveLink>
          </div>
          <p>Loading...</p>
        </div>
      </>
    );
  }
}

class TimeslotSelectorZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selected & currentSelected (map: slot -> boolean), a mapping of each
      // slot to whether it is selected or not.
      selected: this.initializeSelectedSlotsObject(
        this.props.numDays,
        this.props.numSlotsPerDay
      ),
      mouseIsDown: false,
      // The starting slot for each selection during a mouseDown event.
      startingSlot: [],
      // Sort of like a cache (currentSelected) to the main memory (selected)
      currentSelected: this.initializeSelectedSlotsObject(
        this.props.numDays,
        this.props.numSlotsPerDay
      ),
    };
  }

  // Create a map with numDays * numSlotsPerDay keys, all initialized to false.
  initializeSelectedSlotsObject(numDays, numSlotsPerDay) {
    let map = {};
    for (let i = 0; i < numDays; i++) {
      for (let j = 0; j < numSlotsPerDay; j++) {
        map[`${i},${j}`] = false;
      }
    }
    return map;
  }

  // Python range function. Works increasing or decreasing.
  // Class function for now since we may need to do some state manipulation
  // here... TBD.
  range(start, end) {
    if (start > end) {
      return this.range(end, start).reverse();
    } else if (start === end) return [start];
    return [start, ...this.range(start + 1, end)];
  }

  // On the event that the mouse button is clicked on a timeslot, the state must
  // change to reflect this click. We change the "mouseIsDown" state to be true
  // and make the current timeslot the "coords" for the "startingSlot". We then
  // toggle the truthity of the slot
  mouseDown(i, j) {
    this.setState({
      mouseIsDown: true,
      startingSlot: [i, j],
    });
  }

  // On the event that the mouse button is lifted (assuming after it has been
  // clicked), we change the state so that the "mouseIsDown" value is correct
  // and "commit any changes" that we made to our timeslot selection zone
  mouseUp() {
    const newlySelected = { ...this.state.selected };
    let [si, sj] = this.state.startingSlot;
    if (this.state.selected[`${si},${sj}`]) {
      for (const key in newlySelected) {
        newlySelected[key] =
          this.state.currentSelected[key] !== newlySelected[key] &&
          newlySelected[key];
      }
    } else {
      for (const key in newlySelected) {
        newlySelected[key] =
          this.state.currentSelected[key] || newlySelected[key];
      }
    }

    this.setState({
      mouseIsDown: false,
      selected: newlySelected,
      currentSelected: this.initializeSelectedSlotsObject(
        this.props.numDays,
        this.props.numSlotsPerDay
      )
    });
  }

  // If the cursor is down and is hovering over a slot, we want to change the
  // zone from the starting slot to the current slot the cursor is on to
  // respectively change the selection.
  mouseOver(i, j) {
    let [si, sj] = this.state.startingSlot;

    if (this.state.mouseIsDown) {
      // Reset the cache to only select the range between the starting slot and
      // the slot we are hovering over
      this.setState({
        currentSelected: this.initializeSelectedSlotsObject(
          this.props.numDays,
          this.props.numSlotsPerDay
        ),
      });
      this.range(si, i).forEach((num1) => {
        this.range(sj, j).forEach((num2) => {
          this.timeslotSelected(num1, num2);
        });
      });
    }
  }

  // Triggered to ensure that the selected timeslots are committed when leaving 
  // the selector zone.
  mouseLeave() {
    if (this.state.mouseIsDown) {
      this.mouseUp();
    }
  }

  // Update the respective slot depending on the starting slot.
  // If the starting slot was "selected", only deselect selected slots
  // If the starting slot was "unselected" only select deselected slots
  timeslotSelected(day, slot) {
    this.setState((state) => {
      const updatedSelected = { ...state.currentSelected };
      updatedSelected[`${day},${slot}`] = true;
      return { currentSelected: updatedSelected };
    });
  }

  // Update the respective slot depending on its previous value
  timeslotClicked(day, slot) {
    this.setState((state) => {
      const updatedSelected = { ...state.selected };
      updatedSelected[`${day},${slot}`] = !state.selected[`${day},${slot}`];
      return { selected: updatedSelected };
    });
  }

  renderDay(i) {
    const dayZone = [];
    const [si, sj] = this.state?.startingSlot;
    for (let j = 0; j < this.props.numSlotsPerDay; j++) {
      dayZone.push(
        /* Logic for color:
         * Case 1: Currently selecting regions:
         *   Starting slot is selected (i.e. deselecting the region) -> red
         *   Starting slot is not selected (i.e. selecting the region) -> green
         * Case 2: Not currently selecting regions:
         *   Selected regions -> blue
         *   Unselected regions -> transparent
        */
        <div
          className={`${styles.timeslotOverlay} ${this.state.selected[`${si},${sj}`]
            && this.state.currentSelected[`${i},${j}`]
            ? styles.deselectedTimeslot
            : this.state.currentSelected[`${i},${j}`]
              ? styles.currentSelectedTimeslot
              : this.state.selected[`${i},${j}`]
                ? styles.selectedTimeslot
                : styles.unselectedTimeslot
            }`}
          key={`${i},${j}`}
          onClick={() => this.timeslotClicked(i, j)}
          onMouseDown={() => this.mouseDown(i, j)}
          onMouseUp={() => this.mouseUp()}
          onMouseOver={() => this.mouseOver(i, j)}
        ></div>
      );
    }
    return (
      <div key={i} style={{ flexBasis: `${100 / this.props.numDays}%` }}>
        {dayZone}
      </div>
    );
  }

  render() {
    const zone = [];
    const numDays = this.props.numDays;

    for (let i = 0; i < numDays; i++) {
      zone.push(this.renderDay(i));
    }

    return (
      <div
        className={this.props.className}
        onMouseLeave={() => this.mouseLeave()}
      >
        {zone}
      </div>
    );
  }
}

export default Schedule;
