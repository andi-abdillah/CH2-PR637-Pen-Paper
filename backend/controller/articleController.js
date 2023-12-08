const { nanoid } = require("nanoid");
const { Op } = require("sequelize");
const { Article, User, sequelize } = require("../models");
const formattedDate = require("./utils/formattedDate");

// Function to generate a unique article ID
const generateId = () => `article-${nanoid(20)}`;

// Handler to add a new article
const addArticleHandler = async (request, h) => {
  const id = generateId();
  const {
    articleId = id,
    userId,
    title,
    descriptions,
    content,
    createdAt = formattedDate(),
    updatedAt = formattedDate(),
  } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!title || !descriptions || !content) {
      return h
        .response({
          status: "fail",
          message: "Title, descriptions, and content are required fields.",
        })
        .code(400);
    }

    // Additional validation for title and descriptions length
    if (
      title.length > 100 ||
      title.length < 10 ||
      descriptions.length > 250 ||
      descriptions.length < 10
    ) {
      return h
        .response({
          status: "fail",
          message:
            "Title must be between 10 and 100 characters, and descriptions must be between 10 and 250 characters.",
        })
        .code(400);
    }

    // Create a new article
    await Article.create(
      {
        articleId,
        userId,
        title,
        descriptions,
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
            descriptions: createdArticle.descriptions,
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
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    // Set default values for page and pageSize
    const page = parseInt(request.query.page) || 1;
    const pageSize = parseInt(request.query.pageSize) || 3;

    // Calculate the offset based on page and pageSize
    const offset = (page - 1) * pageSize;

    // Find all articles with pagination and order by creation date in descending order
    const articles = await Article.findAndCountAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      offset: offset,
      limit: pageSize,
      where: {
        userId: { [Op.ne]: tokenUserId },
      },
    });

    // Destructure the result object to get count and rows
    const { count, rows } = articles;

    // If no articles, return an empty array
    if (!rows || rows.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            articles: [],
            totalArticles: 0,
            totalPages: 0,
            currentPage: page,
          },
        })
        .code(200);
    }

    // Map articles to a simplified format
    const listArticles = rows.map((article) => ({
      articleId: article.articleId,
      userId: article.userId,
      username: article.user.username,
      title: article.title,
      descriptions: article.descriptions,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    // Calculate total pages
    const totalPages = Math.ceil(count / pageSize);

    // Respond with success and the list of articles, along with pagination details
    return h
      .response({
        status: "success",
        data: {
          articles: listArticles,
          totalArticles: count,
          totalPages: totalPages,
          currentPage: page,
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

// Handler to search articles based on a query string
const searchArticlesHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    const { query } = request.query;

    // Define search condition based on the query string
    const searchCondition = query
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { content: { [Op.like]: `%${query}%` } },
              ],
            },
            { userId: { [Op.ne]: tokenUserId } },
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
      descriptions: article.descriptions,
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
      descriptions: article.descriptions,
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
              descriptions: targetArticle.descriptions,
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
  const { title, descriptions, content } = request.payload;
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!title || !descriptions || !content) {
      return h
        .response({
          status: "fail",
          message: "Title, descriptions, and content are required fields.",
        })
        .code(400);
    }

    // Additional validation for title and descriptions length
    if (
      title.length > 100 ||
      title.length < 10 ||
      descriptions.length > 250 ||
      descriptions.length < 10
    ) {
      return h
        .response({
          status: "fail",
          message:
            "Title must be between 10 and 100 characters, and descriptions must be between 10 and 250 characters.",
        })
        .code(400);
    }

    // Find the article by its ID
    const targetArticle = await Article.findByPk(articleId);

    // Check if the article is found
    if (!targetArticle) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to update the article. Article ID not found.",
        })
        .code(404);
    }

    // Check if the user is authorized to edit the article
    if (tokenUserId !== targetArticle.userId) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Not authorized to edit this article.",
        })
        .code(403); // 403 Forbidden
    }

    // Update the article by its ID and fetch the number of updated rows
    const [, updatedRowCount] = await Article.update(
      {
        title,
        descriptions,
        content,
        updatedAt: formattedDate(),
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
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token

  const t = await sequelize.transaction();

  try {
    // Find the article by its ID
    const targetArticle = await Article.findByPk(articleId);

    // Check if the article is found
    if (!targetArticle) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to delete the article. Article ID not found.",
        })
        .code(404);
    }

    // Check if the user is authorized to delete the article
    if (tokenUserId !== targetArticle.userId) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Not authorized to delete this article.",
        })
        .code(403); // 403 Forbidden
    }

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
