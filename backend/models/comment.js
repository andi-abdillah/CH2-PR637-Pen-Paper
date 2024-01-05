"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Comment, {
        foreignKey: "parentId",
        as: "replies",
      });
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      });
      this.belongsTo(models.User, {
        foreignKey: "mentionedUserId",
        as: "mentionedUser",
      });
    }
  }
  Comment.init(
    {
      commentId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: DataTypes.STRING,
      articleId: DataTypes.STRING,
      parentId: DataTypes.STRING,
      mentionedUserId: DataTypes.STRING,
      comment: DataTypes.TEXT,
      createdAt: DataTypes.STRING,
      updatedAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
      timestamps: false,
    }
  );
  return Comment;
};
