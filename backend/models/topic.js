"use strict";
const { Model } = require("sequelize");
const formattedDate = require("../controller/utils/formattedDate");
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Article, {
        through: "ArticleTopic",
        foreignKey: "topicId",
        as: "articles",
      });
      this.hasMany(models.ArticleTopic, {
        foreignKey: "topicId",
        as: "articleTopics",
      });
    }
  }
  Topic.init(
    {
      topicId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      createdAt: {
        type: DataTypes.STRING,
        defaultValue: () => formattedDate(),
      },
    },
    {
      sequelize,
      modelName: "Topic",
      timestamps: false,
    }
  );
  return Topic;
};
