"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      });
    }
  }
  Bookmark.init(
    {
      userId: DataTypes.STRING,
      articleId: DataTypes.STRING,
      markedAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bookmark",
      timestamps: false,
    }
  );
  return Bookmark;
};
