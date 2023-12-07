"use strict";

const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const { DateTime } = require("luxon");

const timeZone = "Asia/Jakarta";
const now = DateTime.now().setZone(timeZone);
const formattedDate = now.toFormat("yyyy-MM-dd HH:mm:ss");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rawdata = fs.readFileSync(
      path.join(__dirname, "../src/datas/articles.json")
    );
    const articles = JSON.parse(rawdata);

    const usersResult = await queryInterface.sequelize.query(
      `SELECT userId from users;`
    );

    const users = usersResult[0].map((user) => user.userId);

    const seedData = articles.map((article) => ({
      articleId: `article-${nanoid(20)}`,
      userId: getRandomUserId(users),
      title: article.title,
      content: article.content,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    }));

    await queryInterface.bulkInsert("Articles", seedData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Articles", null, {});
  },
};

// Function to get a random userId from the array
function getRandomUserId(users) {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
}
