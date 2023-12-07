const { DateTime } = require("luxon");

const timeZone = "Asia/Jakarta";
const now = DateTime.now().setZone(timeZone);
const formattedDate = now.toFormat("yyyy-MM-dd HH:mm:ss");

module.exports = formattedDate;
