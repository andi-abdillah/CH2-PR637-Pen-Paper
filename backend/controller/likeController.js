const { Article, Like, User, Bookmark, sequelize } = require("../models");
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

const getLikedArticlesForUserHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    // Find all likes for the user
    const likes = await Like.findAll({
      where: {
        userId: tokenUserId,
      },
    });

    // If no likes, return an empty array
    if (!likes || likes.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            likedArticles: [],
            totalLikedArticles: 0,
          },
        })
        .code(200);
    }

    // Map likes to a simplified format
    const listLikedArticles = likes.map(async (like) => {
      // Find the associated article for each like
      const article = await Article.findOne({
        where: { articleId: like.articleId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
      });

      if (!article) {
        // If the associated article is not found, you can handle it as needed
        console.error(`Article not found for likeId: ${like.likeId}`);
        return null;
      }

      // Check if the article is bookmarked by the user
      const isBookmarked = await Bookmark.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Get the number of bookmarks for the article
      const bookmarks = await Bookmark.count({
        where: { articleId: article.articleId },
      });

      return {
        articleId: article.articleId,
        userId: article.userId,
        username: article.user.username,
        title: article.title,
        slug: article.slug,
        descriptions: article.descriptions,
        content: article.content,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        isBookmarked: Boolean(isBookmarked),
        bookmarks: bookmarks || 0,
      };
    });

    // Wait for all promises to resolve
    const resolvedLikedArticles = await Promise.all(listLikedArticles);

    // Filter out null values (if any)
    const filteredLikedArticles = resolvedLikedArticles.filter(
      (likedArticle) => likedArticle !== null
    );

    // Respond with success and the list of liked articles
    return h
      .response({
        status: "success",
        data: {
          likedArticles: filteredLikedArticles,
          totalLikedArticles: filteredLikedArticles.length,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);

    // Respond with an error if an unexpected server error occurs
    return h
      .response({
        status: "error",
        message: "An error occurred on the server.",
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
  getLikedArticlesForUserHandler,
  removeLikeHandler,
};
