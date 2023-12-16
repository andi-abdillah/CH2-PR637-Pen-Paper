const {
  Bookmark,
  User,
  Article,
  Like,
  Comment,
  sequelize,
} = require("../models");
const formattedDate = require("./utils/formattedDate");

const addBookmarkHandler = async (request, h) => {
  const { userId } = request.auth.credentials;
  const { articleId } = request.payload;

  const t = await sequelize.transaction();

  try {
    const markedAt = formattedDate();

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

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      where: { articleId, userId },
    });

    if (existingBookmark) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "You have already bookmarked this article.",
        })
        .code(400);
    }

    // Add Bookmark to the database
    const createdBookmark = await Bookmark.create(
      {
        userId,
        articleId,
        markedAt,
      },
      { transaction: t }
    );

    if (createdBookmark) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "Bookmark added successfully.",
          data: { userId, articleId },
        })
        .code(201);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to add bookmark.",
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

const getBookmarksForUserHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    // Find all bookmarks for the user
    const bookmarks = await Bookmark.findAll({
      order: [["markedAt", "DESC"]],
      where: {
        userId: tokenUserId,
      },
    });

    // If no bookmarks, return an empty array
    if (!bookmarks || bookmarks.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            bookmarks: [],
            totalBookmarks: 0,
          },
        })
        .code(200);
    }

    // Map bookmarks to a simplified format
    const listBookmarks = bookmarks.map(async (bookmark) => {
      // Find the associated article for each bookmark
      const article = await Article.findOne({
        where: { articleId: bookmark.articleId },
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
        console.error(
          `Article not found for bookmarkId: ${bookmark.bookmarkId}`
        );
        return null;
      }

      // Check if the article is liked by the user
      const isLiked = await Like.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Get the number of likes for the article
      const likesCount = await Like.count({
        where: { articleId: article.articleId },
      });

      // Get the number of comments for the article
      const commentsCount = await Comment.count({
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
        isLiked: Boolean(isLiked),
        likesTotal: likesCount || 0,
        commentsTotal: commentsCount || 0,
      };
    });

    // Wait for all promises to resolve
    const resolvedBookmarks = await Promise.all(listBookmarks);

    // Filter out null values (if any)
    const filteredBookmarks = resolvedBookmarks.filter(
      (bookmark) => bookmark !== null
    );

    // Respond with success and the list of bookmarks
    return h
      .response({
        status: "success",
        data: {
          bookmarks: filteredBookmarks,
          totalBookmarks: filteredBookmarks.length,
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

const removeBookmarkHandler = async (request, h) => {
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

    // Remove Bookmark from the database
    const deletedRows = await Bookmark.destroy({
      where: { userId, articleId },
      transaction: t,
    });

    if (deletedRows > 0) {
      await t.commit();
      return h.response({
        status: "success",
        message: "Bookmark removed successfully.",
        data: { userId, articleId },
      });
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Bookmark not found or failed to remove.",
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
  addBookmarkHandler,
  getBookmarksForUserHandler,
  removeBookmarkHandler,
};
