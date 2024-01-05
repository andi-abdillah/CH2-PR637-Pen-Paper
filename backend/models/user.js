"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Article, {
        foreignKey: "userId",
        as: "articles",
      });
      this.hasMany(models.ArticleLike, {
        foreignKey: "userId",
        as: "likes",
      });
      this.hasMany(models.Comment, {
        foreignKey: "userId",
        as: "comments",
      });
      this.hasMany(models.Comment, {
        foreignKey: "mentionedUserId",
        as: "mentionedComments",
      });
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      fullName: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      descriptions: DataTypes.TEXT,
      createdAt: DataTypes.STRING,
      updatedAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};
