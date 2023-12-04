const { nanoid } = require("nanoid");
const { Op } = require("sequelize");
const { Article, User, sequelize } = require("../models");

// Function to generate a unique article ID
const generateId = () => `article-${nanoid(20)}`;

// Handler to add a new article
const addArticleHandler = async (request, h) => {
  const id = generateId();
  const {
    articleId = id,
    userId,
    title,
    content,
    createdAt = new Date(),
    updatedAt = new Date(),
  } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!title || !content) {
      return h
        .response({
          status: "fail",
          message: "Title and content are required fields.",
        })
        .code(400);
    }

    // Create a new article
    await Article.create(
      {
        articleId,
        userId,
        title,
        content,
        createdAt,
        updatedAt,
      },
      { transaction: t }
    );

    // Fetch the created article with associated user
    const createdArticle = await Article.findByPk(articleId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      transaction: t,
    });

    // Commit the transaction
    await t.commit();

    // Respond with success if the article is created
    if (createdArticle) {
      return h
        .response({
          status: "success",
          message: "Article successfully added.",
          data: {
            articleId: createdArticle.articleId,
            userId: createdArticle.userId,
            username: createdArticle.user.username,
            title: createdArticle.title,
            content: createdArticle.content,
            createdAt: createdArticle.createdAt,
            updatedAt: createdArticle.updatedAt,
          },
        })
        .code(201);
    }

    // Respond with an error if the article creation fails
    return h
      .response({
        status: "error",
        message: "Failed to add the article. Please try again later.",
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

// Handler to get all articles
const getAllArticlesHandler = async (request, h) => {
  try {
    // Find all articles and order by creation date in descending order
    const articles = await Article.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
    });

    // If no articles, return an empty array
    if (!articles || articles.length === 0) {
      return h
        .response({
          status: "success",
          data: { articles: [] },
        })
        .code(200);
    }

    // Map articles to a simplified format
    const listArticles = articles.map((article) => ({
      articleId: article.articleId,
      userId: article.userId,
      username: article.user.username,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    // Respond with success and the list of articles
    return h
      .response({
        status: "success",
        data: { articles: listArticles },
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

// Handler to search articles based on a query string
const searchArticlesHandler = async (request, h) => {
  try {
    const { query } = request.query;

    // Define search condition based on the query string
    const searchCondition = query
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { content: { [Op.like]: `%${query}%` } },
          ],
        }
      : {};

    // Find articles matching the search condition
    const articles = await Article.findAll({
      where: searchCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
    });

    // If no articles, return an empty array
    if (!articles || articles.length === 0) {
      return h
        .response({
          status: "success",
          data: { articles: [] },
        })
        .code(200);
    }

    // Map articles to a simplified format
    const listArticles = articles.map((article) => ({
      articleId: article.articleId,
      userId: article.userId,
      username: article.user.username,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    // Respond with success and the list of articles
    return h
      .response({
        status: "success",
        data: { articles: listArticles },
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

// Handler to get articles by user ID
const getArticlesByUserIdHandler = async (request, h) => {
  const { userId } = request.params;

  try {
    // Find articles by user ID and order by creation date in descending order
    const articles = await Article.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
    });

    // If no articles, return an empty array
    if (!articles || articles.length === 0) {
      return h
        .response({
          status: "success",
          data: { articles: [] },
        })
        .code(200);
    }

    // Map articles to a simplified format
    const listArticles = articles.map((article) => ({
      articleId: article.articleId,
      userId: article.userId,
      username: article.user.username,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    // Respond with success and the list of articles
    return h
      .response({
        status: "success",
        data: { articles: listArticles },
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

// Handler to get an article by its ID
const getArticleByIdHandler = async (request, h) => {
  const { articleId } = request.params;

  try {
    // Find the article by its ID with the associated user
    const targetArticle = await Article.findByPk(articleId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
    });

    // If the article is found, respond with success and the article details
    if (targetArticle) {
      return h
        .response({
          status: "success",
          data: {
            article: {
              articleId: targetArticle.articleId,
              userId: targetArticle.userId,
              username: targetArticle.user.username,
              title: targetArticle.title,
              content: targetArticle.content,
              createdAt: targetArticle.createdAt,
              updatedAt: targetArticle.updatedAt,
            },
          },
        })
        .code(200);
    }

    // If the article is not found, respond with a failure message
    return h
      .response({
        status: "fail",
        message: "Article not found.",
      })
      .code(404);
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

// Handler to edit an article by its ID
const editArticleByIdHandler = async (request, h) => {
  const { articleId } = request.params;
  const { title, content } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!title || !content) {
      return h
        .response({
          status: "fail",
          message: "Title and content are required fields.",
        })
        .code(400);
    }

    // Update the article by its ID and fetch the number of updated rows
    const [, updatedRowCount] = await Article.update(
      {
        title,
        content,
        updatedAt: new Date(),
      },
      { where: { articleId }, returning: true, transaction: t }
    );

    // Commit the transaction
    await t.commit();

    // If the article is updated, respond with success
    if (updatedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Article successfully updated.",
        })
        .code(200);
    }

    // If the article is not found, respond with a failure message
    return h
      .response({
        status: "fail",
        message: "Failed to update the article. Article ID not found.",
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

// Handler to delete an article by its ID
const deleteArticleByIdHandler = async (request, h) => {
  const { articleId } = request.params;

  const t = await sequelize.transaction();

  try {
    // Delete the article by its ID and fetch the number of deleted rows
    const deletedRowCount = await Article.destroy({
      where: { articleId },
      transaction: t,
    });

    // Commit the transaction
    await t.commit();

    // If the article is deleted, respond with success
    if (deletedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Article successfully deleted.",
        })
        .code(200);
    }

    // If the article is not found, respond with a failure message
    return h
      .response({
        status: "fail",
        message: "Failed to delete the article. Article ID not found.",
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

// Export the article controller handlers
module.exports = {
  addArticleHandler,
  getAllArticlesHandler,
  searchArticlesHandler,
  getArticlesByUserIdHandler,
  getArticleByIdHandler,
  editArticleByIdHandler,
  deleteArticleByIdHandler,
};
