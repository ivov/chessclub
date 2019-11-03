import { makeDisplayDate } from "./makeDisplayDate";

export const formatTimestamp = timestamp => {
  const dateObject = new Date(timestamp);
  const dateString = makeDisplayDate(dateObject);
  const hours = ("0" + dateObject.getHours()).slice(-2);
  const minutes = ("0" + dateObject.getMinutes()).slice(-2);
  const seconds = ("0" + dateObject.getSeconds()).slice(-2);
  const timeString = `${hours}:${minutes}:${seconds}`;
  const displayTimeAndDate = dateString + " — " + timeString;
  return displayTimeAndDate;
};
