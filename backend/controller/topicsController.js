const { Op, fn, col } = require("sequelize");
const {
  Topic,
  Article,
  ArticleTopic,
  User,
  Like,
  Bookmark,
  Comment,
} = require("../models");

// Handler to search topics based on a query string and filter by article count
const searchTopicsHandler = async (request, h) => {
  try {
    const { query } = request.query;

    // Define search condition based on the query string
    const searchCondition = query
      ? {
          name: { [Op.like]: `%${query}%` },
        }
      : {};

    // Find topics matching the search condition with article count
    const topics = await Topic.findAll({
      where: searchCondition,
      attributes: [
        "topicId",
        "name",
        [fn("COUNT", col("articleTopics.articleId")), "articleCount"],
        "createdAt",
      ],
      include: [
        {
          model: ArticleTopic,
          as: "articleTopics",
          attributes: [],
        },
      ],
      group: ["Topic.topicId"],
      order: [
        [col("articleCount"), "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    // If no topics, return an empty array
    if (!topics || topics.length === 0) {
      return h
        .response({
          status: "success",
          data: { topics: [] },
        })
        .code(200);
    }

    // Map topics to a simplified format
    const listTopics = topics.map((topic) => ({
      topicId: topic.topicId,
      name: topic.name,
      totalArticles: topic.get("articleCount"),
      createdAt: topic.createdAt,
    }));

    return h
      .response({
        status: "success",
        data: { topics: listTopics },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Handler to get all topics
const getAllTopicsHandler = async (request, h) => {
  try {
    // Find all topics with article count
    const topics = await Topic.findAll({
      attributes: [
        "topicId",
        "name",
        "createdAt",
        [fn("COUNT", col("articleTopics.articleId")), "articleCount"],
      ],
      include: [
        {
          model: ArticleTopic,
          as: "articleTopics",
          attributes: [],
        },
      ],
      group: ["Topic.topicId"],
      order: [
        [col("articleCount"), "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    // If no topics, return an empty array
    if (!topics || topics.length === 0) {
      return h
        .response({
          status: "success",
          data: { topics: [] },
        })
        .code(200);
    }

    // Map topics to a simplified format
    const listTopics = topics.map((topic) => ({
      topicId: topic.topicId,
      name: topic.name,
      totalArticles: topic.get("articleCount"),
      createdAt: topic.createdAt,
    }));

    return h
      .response({
        status: "success",
        data: { topics: listTopics },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Handler to get all articles based on a specific topic
const getAllArticlesByTopicHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    const { query } = request.query;

    // Find the topic by name
    const topic = await Topic.findOne({
      where: { name: query },
    });

    // If the topic is not found, return an empty array
    if (!topic) {
      return h
        .response({
          status: "success",
          data: { articles: [] },
        })
        .code(200);
    }

    // Find all articles related to the topic
    const articles = await Article.findAll({
      attributes: [
        "articleId",
        "userId",
        "title",
        "slug",
        "descriptions",
        "content",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
        {
          model: ArticleTopic,
          as: "articleTopics",
          attributes: [],
          where: { topicId: topic.topicId },
        },
      ],
      order: [["createdAt", "DESC"]],
      where: {
        userId: { [Op.ne]: tokenUserId }, // Filter out articles by the current user
      },
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
    const listArticles = articles.map(async (article) => {
      // Check if the article is liked by the user
      const isLiked = await Like.findOne({
        where: { userId: tokenUserId, articleId: article.articleId },
      });

      // Check if the article is bookmarked by the user
      const isBookmarked = await Bookmark.findOne({
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
        isBookmarked: Boolean(isBookmarked),
        likesTotal: likesCount,
        commentsTotal: commentsCount,
      };
    });

    // Wait for all article mappings to complete
    const fullArticles = await Promise.all(listArticles);

    // Respond with the list of articles
    return h
      .response({
        status: "success",
        data: { articles: fullArticles },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Handler to search topics by name
const searchTopicByNameHandler = async (request, h) => {
  try {
    const { query } = request.query;

    // Find topics matching the search condition with article count
    const topics = await Topic.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
      },
      attributes: [
        "topicId",
        "name",
        [fn("COUNT", col("articleTopics.articleId")), "articleCount"],
        "createdAt",
      ],
      include: [
        {
          model: ArticleTopic,
          as: "articleTopics",
          attributes: [],
        },
      ],
      group: ["Topic.topicId"],
      order: [
        [col("articleCount"), "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    // If no topics, return an empty array
    if (!topics || topics.length === 0) {
      return h
        .response({
          status: "success",
          data: { topics: [] },
        })
        .code(200);
    }

    // Map topics to a simplified format
    const listTopics = topics.map((topic) => ({
      topicId: topic.topicId,
      name: topic.name,
      totalArticles: topic.get("articleCount"),
      createdAt: topic.createdAt,
    }));

    return h
      .response({
        status: "success",
        data: { topics: listTopics },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Export the topic search handler
module.exports = {
  searchTopicsHandler,
  getAllTopicsHandler,
  getAllArticlesByTopicHandler,
  searchTopicByNameHandler,
};
