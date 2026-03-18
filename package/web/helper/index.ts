function getStartAndEndOfMonthUTC(date = new Date()) {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth();
  let firstOfMonth = new Date(Date.UTC(y, m, 1));
  let lastOfMonth = new Date(Date.UTC(y, m + 1, 0));
  return {
    currentMonth: months[m],
    firstOfMonth: firstOfMonth.getDate(),
    lastOfMonth: lastOfMonth.getDate(),
  };
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export { getStartAndEndOfMonthUTC };
