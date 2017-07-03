
module.exports = (res) => {
  const date = new Date();
  let dateObj = {
    dt: date.toLocaleString('en-US', { hour12: false }),
    day: date.getDate(),
    dayIndex: date.getDay(),
    month: date.getMonth(),
    year: date.getFullYear(),
    time: date.toLocaleTimeString('en-US', { hour12: false })
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(dateObj));
};
