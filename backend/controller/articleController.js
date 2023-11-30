const { nanoid } = require("nanoid");
const { Article } = require("../models");
const { User } = require("../models");

const generateId = () => `article-${nanoid(20)}`;

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

  try {
    await Article.create({
      articleId,
      userId,
      title,
      content,
      createdAt,
      updatedAt,
    });

    const createdArticle = await Article.findByPk(articleId);

    if (createdArticle) {
      return h
        .response({
          status: "success",
          message: "Artikel berhasil ditambahkan",
          data: {
            articleId,
          },
        })
        .code(201);
    }

    return h
      .response({
        status: "error",
        message: "Artikel gagal ditambahkan",
      })
      .code(500);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const getAllArticlesHandler = async (request, h) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
    });

    if (!articles || articles.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            articles: [],
          },
        })
        .code(200);
    }

    const listArticles = articles.map((article) => ({
      articleId: article.articleId,
      userId: article.userId,
      username: article.user.username,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    return h
      .response({
        status: "success",
        data: {
          articles: listArticles,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const searchArticlesHandler = async (request, h) => {
  try {
    const { search } = request.query;

    const searchCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { content: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

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

    if (!articles || articles.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            articles: [],
          },
        })
        .code(200);
    }

    const listArticles = articles.map((article) => ({
      articleId: article.articleId,
      userId: article.userId,
      username: article.user.username,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    return h
      .response({
        status: "success",
        data: {
          articles: listArticles,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const getArticleByIdHandler = async (request, h) => {
  const { articleId } = request.params;
  const targetArticle = await Article.findByPk(articleId, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["username"],
      },
    ],
  });

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
          },
        },
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Artikel tidak ditemukan",
    })
    .code(404);
};

const editArticleByIdHandler = async (request, h) => {
  const { articleId } = request.params;
  const { title, content } = request.payload;

  try {
    const [, updatedRowCount] = await Article.update(
      {
        title,
        content,
        updatedAt: new Date(),
      },
      { where: { articleId }, returning: true }
    );

    if (updatedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Artikel berhasil diperbarui",
        })
        .code(200);
    }

    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui artikel. Id tidak ditemukan",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const deleteArticleByIdHandler = async (request, h) => {
  const { articleId } = request.params;

  try {
    const deletedRowCount = await Article.destroy({ where: { articleId } });

    if (deletedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Artikel berhasil dihapus",
        })
        .code(200);
    }

    return h
      .response({
        status: "fail",
        message: "Artikel gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

module.exports = {
  addArticleHandler,
  getAllArticlesHandler,
  searchArticlesHandler,
  getArticleByIdHandler,
  editArticleByIdHandler,
  deleteArticleByIdHandler,
};
