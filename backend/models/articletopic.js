"use strict";
const { Model } = require("sequelize");
const formattedDate = require("../controller/utils/formattedDate");
module.exports = (sequelize, DataTypes) => {
  class ArticleTopic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ArticleTopic.init(
    {
      articleId: DataTypes.STRING,
      topicId: DataTypes.STRING,
      createdAt: {
        type: DataTypes.STRING,
        defaultValue: () => formattedDate(),
      },
    },
    {
      sequelize,
      modelName: "ArticleTopic",
      timestamps: false,
    }
  );
  return ArticleTopic;
};
