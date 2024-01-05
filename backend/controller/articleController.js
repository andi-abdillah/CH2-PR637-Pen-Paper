const { nanoid } = require("nanoid");
const { Op } = require("sequelize");
const {
  Article,
  User,
  ArticleLike,
  Bookmark,
  Comment,
  Topic,
  ArticleTopic,
  sequelize,
} = require("../models");
const formattedDate = require("./utils/formattedDate");
const slugify = require("slugify");

// Function to generate a unique article ID
const generateArticleId = () => `article-${nanoid(20)}`;

// Function to generate a unique topic ID
const generateTopicId = () => `topic-${nanoid(20)}`;

// Function to generate a unique slug based on the title
const generateSlug = (title) => {
  const baseSlug = slugify(title, { lower: true });
  const uniqueSlug = nanoid(12);
  return `${baseSlug}-${uniqueSlug}`;
};

// Handler to add a new article
const addArticleHandler = async (request, h) => {
  const articleId = generateArticleId();
  const {
    userId,
    title,
    descriptions,
    content,
    createdAt = formattedDate(),
    updatedAt = formattedDate(),
    topics = [],
  } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!title || !descriptions || !content || topics.length === 0) {
      return h
        .response({
          status: "fail",
          message:
            "Title, descriptions, content, and at least one topic are required fields.",
        })
        .code(400);
    }

    // Additional validation for title and descriptions length
    if (
      title.length > 100 ||
      title.length < 5 ||
      descriptions.length > 250 ||
      descriptions.length < 10
    ) {
      return h
        .response({
          status: "fail",
          message:
            "Title must be between 5 and 100 characters, and descriptions must be between 10 and 250 characters.",
        })
        .code(400);
    }

    // Create a new article with a generated slug
    const slug = generateSlug(title);

    // Create the article
    const createdArticle = await Article.create(
      {
        articleId,
        userId,
        title,
        slug,
        descriptions,
        content,
        createdAt,
        updatedAt,
      },
      { transaction: t }
    );

    // Associate topics with the article
    const topicPromises = topics.map(async (topicName) => {
      // Find or create the topic by name
      const [topic, created] = await Topic.findOrCreate({
        where: { name: topicName },
        defaults: { topicId: generateTopicId() },
        transaction: t,
      });

      // Associate the topic with the article
      await ArticleTopic.create(
        {
          articleId: createdArticle.articleId,
          topicId: topic.topicId,
          createdAt: formattedDate(),
        },
        { transaction: t }
      );
    });

    // Wait for all topic associations to complete
    await Promise.all(topicPromises);

    // Fetch the created article with associated user and topics
    const fullArticle = await Article.findByPk(createdArticle.articleId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
        {
          model: Topic,
          as: "topics",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      transaction: t,
    });

    // Commit the transaction
    await t.commit();

    // Respond with success if the article is created
    if (fullArticle) {
      return h
        .response({
          status: "success",
          message: "Article successfully added.",
          data: {
            articleId: fullArticle.articleId,
            userId: fullArticle.userId,
            username: fullArticle.user.username,
            title: fullArticle.title,
            descriptions: fullArticle.descriptions,
            content: fullArticle.content,
            createdAt: fullArticle.createdAt,
            updatedAt: fullArticle.updatedAt,
            topics: fullArticle.topics.map((topic) => topic.name),
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

    // Map articles to a simplified format with like and bookmark information
    const listArticles = rows.map(async (article) => {
      // Check if the article is liked by the user
      const isLiked = await ArticleLike.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Check if the article is bookmarked by the user
      const isBookmarked = await Bookmark.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Get the number of likes for the article
      const likesCount = await ArticleLike.count({
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
        isBookmarked: Boolean(isBookmarked),
        likesTotal: likesCount,
        commentsTotal: commentsCount,
      };
    });

    // Wait for all article mappings to complete
    const fullArticles = await Promise.all(listArticles);

    // Calculate total pages based on total articles and pageSize
    const totalPages = Math.ceil(count / pageSize);

    // Respond with the list of articles, total articles, total pages, and current page
    return h
      .response({
        status: "success",
        data: {
          articles: fullArticles,
          totalArticles: count,
          totalPages,
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

    // Map articles to a simplified format with like and bookmark information
    const listArticles = articles.map(async (article) => {
      // Check if the article is liked by the user
      const isLiked = await ArticleLike.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Check if the article is bookmarked by the user
      const isBookmarked = await Bookmark.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Get the number of likes for the article
      const likesCount = await ArticleLike.count({
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
        isBookmarked: Boolean(isBookmarked),
        likesTotal: likesCount,
        commentsTotal: commentsCount,
      };
    });

    // Respond with success and the list of articles
    return h
      .response({
        status: "success",
        data: { articles: await Promise.all(listArticles) },
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
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    const { userId } = request.params;

    // Find articles by user ID
    const articles = await Article.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
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

    // Map articles to a simplified format with like and bookmark information
    const listArticles = articles.map(async (article) => {
      // Check if the article is liked by the user
      const isLiked = await ArticleLike.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Check if the article is bookmarked by the user
      const isBookmarked = await Bookmark.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Get the number of likes for the article
      const likesCount = await ArticleLike.count({
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
        isBookmarked: Boolean(isBookmarked),
        likesTotal: likesCount,
        commentsTotal: commentsCount,
      };
    });

    // Respond with success and the list of articles
    return h
      .response({
        status: "success",
        data: { articles: await Promise.all(listArticles) },
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

// Handler to get an article by its slug
const getArticleBySlugHandler = async (request, h) => {
  const { slug } = request.params;
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    // Find the article by its slug with the associated user and topics
    const targetArticle = await Article.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
        {
          model: Topic,
          as: "topics",
          attributes: ["name"],
          through: { attributes: [] }, // Exclude unnecessary attributes from the join table
        },
      ],
    });

    // If the article is found, respond with success and the article details
    if (targetArticle) {
      // Check if the article is liked by the user
      const isLiked = await ArticleLike.findOne({
        where: { userId: tokenUserId, articleId: targetArticle.articleId },
      });

      // Check if the article is bookmarked by the user
      const isBookmarked = await Bookmark.findOne({
        where: { userId: tokenUserId, articleId: targetArticle.articleId },
      });

      // Get the number of likes for the article
      const likesCount = await ArticleLike.count({
        where: { articleId: targetArticle.articleId },
      });

      // Get the number of comments for the article
      const commentsCount = await Comment.count({
        where: { articleId: targetArticle.articleId },
      });

      return h
        .response({
          status: "success",
          data: {
            article: {
              articleId: targetArticle.articleId,
              userId: targetArticle.userId,
              username: targetArticle.user.username,
              title: targetArticle.title,
              slug: targetArticle.slug,
              topics: targetArticle.topics.map((topic) => topic.name),
              descriptions: targetArticle.descriptions,
              content: targetArticle.content,
              createdAt: targetArticle.createdAt,
              updatedAt: targetArticle.updatedAt,
              isLiked: Boolean(isLiked),
              isBookmarked: Boolean(isBookmarked),
              likesTotal: likesCount,
              commentsTotal: commentsCount,
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

// Handler to edit an article by its slug
const editArticleBySlugHandler = async (request, h) => {
  const { slug } = request.params;
  const { title, descriptions, content, topics } = request.payload;
  const { userId: tokenUserId } = request.auth.credentials;

  const t = await sequelize.transaction();

  try {
    // Payload validation
    if (!title || !descriptions || !content || topics.length === 0) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Title, descriptions, content, and at least one topic are required fields.",
        })
        .code(400);
    }

    // Additional validation for title and descriptions length
    if (
      title.length > 100 ||
      title.length < 5 ||
      descriptions.length > 250 ||
      descriptions.length < 10
    ) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Title must be between 5 and 100 characters, and descriptions must be between 10 and 250 characters.",
        })
        .code(400);
    }

    // Find the article by its slug
    const targetArticle = await Article.findOne({
      where: { slug },
      include: [{ model: Topic, as: "topics", attributes: ["topicId"] }],
    });

    // Check if the article is found
    if (!targetArticle) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to update the article. Article not found.",
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

    // Update the article by its slug and fetch the number of updated rows
    const [, updatedRowCount] = await Article.update(
      {
        title,
        slug: generateSlug(title),
        descriptions,
        content,
        updatedAt: formattedDate(),
      },
      { where: { slug }, returning: true, transaction: t }
    );

    // Collect existing topicIds
    const existingTopicIds = targetArticle.topics.map((topic) => topic.topicId);

    // Find new topicIds (those not in existingTopicIds)
    const newTopicIds = topics
      .map((topicName) => {
        const existingTopic = targetArticle.topics.find(
          (topic) => topic.name === topicName
        );
        return existingTopic ? existingTopic.topicId : null;
      })
      .filter((topicId) => topicId !== null);

    // Find topicIds to be removed (those in existingTopicIds but not in newTopicIds)
    const topicsToRemove = existingTopicIds.filter(
      (topicId) => !newTopicIds.includes(topicId)
    );

    // Remove topics from ArticleTopic
    await ArticleTopic.destroy({
      where: { articleId: targetArticle.articleId, topicId: topicsToRemove },
      transaction: t,
    });

    // Add new topics to ArticleTopic
    const topicPromises = topics.map(async (topicName) => {
      // Find or create the topic by name
      const [topic, created] = await Topic.findOrCreate({
        where: { name: topicName },
        defaults: { topicId: generateTopicId() },
        transaction: t,
      });

      // Associate the topic with the article
      await ArticleTopic.findOrCreate({
        where: {
          articleId: targetArticle.articleId,
          topicId: topic.topicId,
        },
        defaults: {
          createdAt: formattedDate(),
        },
        transaction: t,
      });
    });

    // Wait for all topic associations to complete
    await Promise.all(topicPromises);

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
        message: "Failed to update the article. Article not found.",
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

// Handler to delete an article by its slug
const deleteArticleBySlugHandler = async (request, h) => {
  const { slug } = request.params;
  const { userId: tokenUserId } = request.auth.credentials;

  const t = await sequelize.transaction();

  try {
    // Find the article by its slug
    const targetArticle = await Article.findOne({
      where: { slug },
    });

    // Check if the article is found
    if (!targetArticle) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to delete the article. Article not found.",
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

    // Delete likes associated with the article
    await ArticleLike.destroy({
      where: { articleId: targetArticle.articleId },
      transaction: t,
    });

    // Delete bookmarks associated with the article
    await Bookmark.destroy({
      where: { articleId: targetArticle.articleId },
      transaction: t,
    });

    // Delete comments associated with the article
    await Comment.destroy({
      where: { articleId: targetArticle.articleId },
      transaction: t,
    });

    // Delete the article by its slug and fetch the number of deleted rows
    const deletedRowCount = await Article.destroy({
      where: { slug },
      transaction: t,
    });

    // Delete associated ArticleTopics
    await ArticleTopic.destroy({
      where: { articleId: targetArticle.articleId },
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
        message: "Failed to delete the article. Article not found.",
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
  getArticleBySlugHandler,
  editArticleBySlugHandler,
  deleteArticleBySlugHandler,
};
