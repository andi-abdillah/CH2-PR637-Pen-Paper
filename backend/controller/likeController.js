const { Article, Like, sequelize } = require("../models");
const formattedDate = require("./utils/formattedDate");

const addLikeHandler = async (request, h) => {
  const { userId } = request.auth.credentials;
  const { articleId } = request.payload;

  const t = await sequelize.transaction();

  try {
    const likedAt = formattedDate();

    // Validate articleId
    if (!articleId) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "articleId is required.",
        })
        .code(400);
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({
      where: { articleId, userId },
    });

    if (existingLike) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "You have already liked this article.",
        })
        .code(400);
    }

    // Add Like to the database
    const createdLike = await Like.create(
      {
        userId,
        articleId,
        likedAt,
      },
      { transaction: t }
    );

    if (createdLike) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "Like added successfully.",
          data: { userId, articleId },
        })
        .code(201);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to add like.",
      })
      .code(500);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Internal server error.",
      })
      .code(500);
  }
};

const getLikesForArticleHandler = async (articleId) => {
  try {
    const isArticleExists = async (articleId) => {
      const article = await Article.findOne({ where: { articleId } });
      return article !== null;
    };

    // Check if the article exists
    const articleExists = await isArticleExists(articleId);

    if (!articleExists) {
      return null;
    }

    const likes = await Like.findAll({
      where: { articleId: articleId },
    });

    return {
      data: { likes: likes.length },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const removeLikeHandler = async (request, h) => {
  const { userId } = request.auth.credentials;
  const { articleId } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Validate articleId
    if (!articleId) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "articleId is required.",
        })
        .code(400);
    }

    // Remove Like from the database
    const deletedRows = await Like.destroy({
      where: { userId, articleId },
      transaction: t,
    });

    if (deletedRows > 0) {
      await t.commit();
      return h.response({
        status: "success",
        message: "Like removed successfully.",
        data: { userId, articleId },
      });
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Like not found or failed to remove.",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Internal server error.",
      })
      .code(500);
  }
};

module.exports = {
  addLikeHandler,
  getLikesForArticleHandler,
  removeLikeHandler,
};
