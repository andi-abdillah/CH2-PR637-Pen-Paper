const { DateTime } = require("luxon");

const formattedDate = () => {
  const timeZone = "Asia/Jakarta";
  const now = DateTime.now().setZone(timeZone);
  return now.toFormat("yyyy-MM-dd HH:mm:ss");
};

module.exports = formattedDate;
