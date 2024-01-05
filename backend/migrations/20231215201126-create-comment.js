"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Comments", {
      commentId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
      },
      articleId: {
        type: Sequelize.STRING,
      },
      parentId: {
        type: Sequelize.STRING,
        references: {
          model: "Comments",
          key: "commentId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      mentionedUserId: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Comments");
  },
};
