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
        articleId,
        userId,
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
          data: { articleId, userId },
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

const getLikesForArticleHandler = async (request, h) => {
  try {
    const { articleId } = request.params;

    // Validate articleId
    if (!articleId) {
      return h
        .response({
          status: "fail",
          message: "articleId is required.",
        })
        .code(400);
    }

    const isArticleExists = async (articleId) => {
      const article = await Article.findOne({ where: { articleId } });
      return article !== null;
    };

    // Check if the article exists
    const articleExists = await isArticleExists(articleId);

    if (!articleExists) {
      return h
        .response({
          status: "fail",
          message: "Article not found.",
        })
        .code(404);
    }

    const likes = await Like.findAll({
      where: { articleId },
    });

    return h.response({
      status: "success",
      data: { likes },
    });
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Internal server error.",
      })
      .code(500);
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
      where: { articleId, userId },
      transaction: t,
    });

    if (deletedRows > 0) {
      await t.commit();
      return h.response({
        status: "success",
        message: "Like removed successfully.",
        data: { articleId, userId },
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
