"use strict";
const { Model } = require("sequelize");
const slugify = require("slugify");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Di model Article
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      this.hasMany(models.Like, {
        foreignKey: "articleId",
        as: "likes",
      });
    }
  }
  Article.init(
    {
      articleId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: DataTypes.STRING,
      title: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      descriptions: DataTypes.TEXT,
      content: DataTypes.TEXT,
      createdAt: DataTypes.STRING,
      updatedAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Article",
      timestamps: false,
      hooks: {
        beforeValidate: (article) => {
          if (article.title) {
            const baseSlug = slugify(article.title, { lower: true });
            const uniqueSlug = nanoid(12);
            article.slug = `${baseSlug}-${uniqueSlug}`;
          }
        },
      },
    }
  );
  return Article;
};
