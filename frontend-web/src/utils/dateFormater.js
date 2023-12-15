import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

const dateFormater = (dateString) => {
  // Parse the input string into a Date object
  const inputDate = new Date(dateString);

  // Format the Date object using timeAgo
  return timeAgo.format(inputDate);
};

export { dateFormater };
