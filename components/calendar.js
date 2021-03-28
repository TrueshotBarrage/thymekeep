import React, { useEffect, useState } from "react";

const days_of_week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const days_of_week_short = [
  "Sun",
  "Mon",
  "Tues",
  "Wed",
  "Thur",
  "Fri",
  "Sat"
]

const months = {
  "January": 31,
  "February": 28,
  "March": 31,
  "April": 30,
  "May": 31,
  "June": 30,
  "July": 31,
  "August": 31,
  "September": 30,
  "October": 31,
  "November": 30,
  "December": 30
}

const months_short = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]


function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getDaysInMonth(m, y) {
  if (m == 2 && isLeapYear(y)) {
    return 29
  }
  else { return months.get(m - 1) }
}


const Calendar = () => {

  return (
    <div>
      TEST HERE
    </div >
  );
}


export default Calendar