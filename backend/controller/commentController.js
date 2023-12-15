const { nanoid } = require("nanoid");
const { Comment, User, Article, sequelize } = require("../models");
const formattedDate = require("./utils/formattedDate");

const generateId = () => `comment-${nanoid(20)}`;

const addCommentHandler = async (request, h) => {
  const commentId = generateId();
  const {
    userId,
    articleId,
    comment,
    createdAt = formattedDate(),
    updatedAt = formattedDate(),
  } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!userId || !articleId || !comment) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "UserId, ArticleId, and Comment are required fields.",
        })
        .code(400);
    }

    // Create a new comment
    const newComment = await Comment.create(
      { commentId, userId, articleId, comment, createdAt, updatedAt },
      { transaction: t }
    );

    // Fetch the created comment with associated user and article
    const createdComment = await Comment.findByPk(commentId, {
      include: [
        { model: User, as: "user", attributes: ["username"] },
        { model: Article, as: "article", attributes: ["title"] },
      ],
      transaction: t,
    });

    // Commit the transaction
    await t.commit();

    // Respond with success if the comment is created
    if (createdComment) {
      return h
        .response({
          status: "success",
          message: "Comment successfully added.",
          data: {
            commentId: createdComment.commentId,
            userId: createdComment.userId,
            username: createdComment.user.username,
            articleId: createdComment.articleId,
            articleTitle: createdComment.article.title,
            comment: createdComment.comment,
            createdAt: createdComment.createdAt,
            updatedAt: createdComment.updatedAt,
          },
        })
        .code(201);
    }

    // Respond with an error if the comment creation fails
    return h
      .response({
        status: "error",
        message: "Failed to add the comment. Please try again later.",
      })
      .code(500);
  } catch (error) {
    // Rollback the transaction in case of an error
    await t.rollback();

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

const getAllArticleCommentsHandler = async (request, h) => {
  try {
    const { articleId } = request.params; // Assuming you have the articleId in the request params
    const comments = await Comment.findAll({
      where: { articleId }, // Filter comments based on the articleId
      include: [{ model: User, as: "user", attributes: ["username"] }],
    });

    return h
      .response({
        status: "success",
        data: {
          comments: comments.map((comment) => ({
            commentId: comment.commentId,
            userId: comment.userId,
            username: comment.user.username,
            articleId: comment.articleId,
            comment: comment.comment,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          })),
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);

    return h
      .response({
        status: "error",
        message: "An error occurred on the server.",
      })
      .code(500);
  }
};

const editCommentHandler = async (request, h) => {
  const { commentId } = request.params;
  const { comment } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!comment) {
      await t.rollback();
      return h
        .response({ status: "fail", message: "Comment is a required field." })
        .code(400);
    }

    // Find the comment by its commentId
    const targetComment = await Comment.findOne({ where: { commentId } });

    // Check if the comment is found
    if (!targetComment) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to update the comment. Comment not found.",
        })
        .code(404);
    }

    // Update the comment by its commentId and fetch the number of updated rows
    const [, updatedRowCount] = await Comment.update(
      { comment, updatedAt: formattedDate() },
      { where: { commentId }, returning: true, transaction: t }
    );

    // Commit the transaction
    await t.commit();

    // If the comment is updated, respond with success
    if (updatedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Comment successfully updated.",
        })
        .code(200);
    }

    // If the comment is not found, respond with a failure message
    return h
      .response({
        status: "fail",
        message: "Failed to update the comment. Comment not found.",
      })
      .code(404);
  } catch (error) {
    // Rollback the transaction in case of an error
    await t.rollback();

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

const deleteCommentHandler = async (request, h) => {
  const { commentId } = request.params;

  const t = await sequelize.transaction();

  try {
    // Find the comment by its commentId
    const targetComment = await Comment.findOne({ where: { commentId } });

    // Check if the comment is found
    if (!targetComment) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to delete the comment. Comment not found.",
        })
        .code(404);
    }

    // Delete the comment by its commentId and fetch the number of deleted rows
    const deletedRowCount = await Comment.destroy({
      where: { commentId },
      transaction: t,
    });

    // Commit the transaction
    await t.commit();

    // If the comment is deleted, respond with success
    if (deletedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Comment successfully deleted.",
        })
        .code(200);
    }

    // If the comment is not found, respond with a failure message
    return h
      .response({
        status: "fail",
        message: "Failed to delete the comment. Comment not found.",
      })
      .code(404);
  } catch (error) {
    // Rollback the transaction in case of an error
    await t.rollback();

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

module.exports = {
  addCommentHandler,
  getAllArticleCommentsHandler,
  editCommentHandler,
  deleteCommentHandler,
};
