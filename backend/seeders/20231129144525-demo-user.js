"use strict";

const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rawdata = fs.readFileSync(
      path.join(__dirname, "../src/datas/users.json")
    );
    const users = JSON.parse(rawdata);

    const seedData = users.map((user) => ({
      userId: `user-${nanoid(20)}`,
      username: user.username,
      email: user.email,
      password: user.password,
      descriptions: user.descriptions,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Users", seedData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
