import React from "react";

const days_of_week = [
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
]

const days_of_week_short = [
  Sun,
  Mon,
  Tues,
  Wed,
  Thur,
  Fri,
  Sat
]

const months = {
  FebruaryLY: 29,
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
  December: 30
}

const months_short = [Jan, Feb, Mar, Apr, May, June, Jul, Aug, Sept, Oct, Nov, Dec]

const isLeapYear = (year) => {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
const getDaysInMonth = (m, y) => {
  if (isLeapYear(y)) {

  }
}
const Calendar = () => {
  return (
    <div>
      <h2>Calendar</h2>
    </div>
  );
}


export default Calendar