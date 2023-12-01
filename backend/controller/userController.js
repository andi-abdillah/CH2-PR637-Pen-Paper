const { nanoid } = require("nanoid");
const { Op } = require("sequelize");
const { User, Article, sequelize } = require("../models");

const generateId = () => `user-${nanoid(20)}`;

const addUserHandler = async (request, h) => {
  const id = generateId();
  const {
    userId = id,
    username,
    email,
    password,
    descriptions,
    createdAt = new Date(),
    updatedAt = new Date(),
  } = request.payload;

  const t = await sequelize.transaction();
  try {
    const createdUser = await User.create(
      {
        userId,
        username,
        email,
        password,
        descriptions,
        createdAt,
        updatedAt,
      },
      { transaction: t }
    );

    if (createdUser) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "Pengguna berhasil ditambahkan",
          data: {
            userId,
          },
        })
        .code(201);
    }

    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Pengguna gagal ditambahkan",
      })
      .code(500);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const getAllUsersHandler = async (request, h) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });

    if (!users || users.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            users: [],
          },
        })
        .code(200);
    }

    const listUsers = users.map((user) => ({
      userId: user.userId,
      username: user.username,
      email: user.email,
      password: user.password,
      descriptions: user.descriptions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return h
      .response({
        status: "success",
        data: {
          users: listUsers,
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

const searchUsersHandler = async (request, h) => {
  try {
    const { query } = request.query;

    const searchCondition = query
      ? {
          username: { [Op.like]: `%${query}%` },
        }
      : {};

    const users = await User.findAll({
      where: searchCondition,
      order: [["createdAt", "DESC"]],
    });

    if (!users || users.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            users: [],
          },
        })
        .code(200);
    }

    const listUsers = users.map((user) => ({
      userId: user.userId,
      username: user.username,
      email: user.email,
      password: user.password,
      descriptions: user.descriptions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return h
      .response({
        status: "success",
        data: {
          users: listUsers,
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

const getUserByIdHandler = async (request, h) => {
  const { userId } = request.params;
  const targetUser = await User.findByPk(userId);

  if (targetUser) {
    return h
      .response({
        status: "success",
        data: {
          user: {
            userId: targetUser.userId,
            username: targetUser.username,
            email: targetUser.email,
            password: targetUser.password,
            descriptions: targetUser.descriptions,
            createdAt: targetUser.createdAt,
            updatedAt: targetUser.updatedAt,
          },
        },
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Pengguna tidak ditemukan",
    })
    .code(404);
};

const editUserProfileHandler = async (request, h) => {
  const { userId } = request.params;
  const { username, email } = request.payload;

  if (!username || !email) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui profil pengguna. Mohon isi semua kolom yang diperlukan",
      })
      .code(400);
  }

  const t = await sequelize.transaction();

  try {
    const [, updatedRowCount] = await User.update(
      {
        username,
        email,
        updatedAt: new Date(),
      },
      { where: { userId }, returning: true, transaction: t }
    );

    if (updatedRowCount > 0) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "Profil pengguna berhasil diperbarui",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui profil pengguna. Id tidak ditemukan",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const editUserPasswordHandler = async (request, h) => {
  const { userId } = request.params;
  const { currentPassword, newPassword, confirmPassword } = request.payload;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui kata sandi pengguna. Mohon isi semua kolom yang diperlukan",
      })
      .code(400);
  }

  if (newPassword !== confirmPassword) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui kata sandi pengguna. Kata sandi tidak sesuai",
      })
      .code(400);
  }

  const t = await sequelize.transaction();

  try {
    const targetUser = await User.findByPk(userId);

    if (!targetUser) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Gagal memperbarui kata sandi pengguna. Id tidak ditemukan",
        })
        .code(404);
    }

    await User.update(
      {
        password: newPassword,
        updatedAt: new Date(),
      },
      { where: { userId }, transaction: t }
    );

    await t.commit();
    return h
      .response({
        status: "success",
        message: "Kata sandi pengguna berhasil diperbarui",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const editUserDescriptionsHandler = async (request, h) => {
  const { userId } = request.params;
  const { descriptions } = request.payload;

  const t = await sequelize.transaction();

  try {
    const [, updatedRowCount] = await User.update(
      {
        descriptions,
        updatedAt: new Date(),
      },
      { where: { userId }, returning: true, transaction: t }
    );

    if (updatedRowCount > 0) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "Deskripsi pengguna berhasil diperbarui",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui deskripsi pengguna. Id tidak ditemukan",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

const deleteUserByIdHandler = async (request, h) => {
  const { userId } = request.params;

  const t = await sequelize.transaction();

  try {
    const deletedUserRowCount = await User.destroy({
      where: { userId },
      transaction: t,
    });

    const deletedArticleRowCount = await Article.destroy({
      where: { userId },
      transaction: t,
    });

    if (deletedUserRowCount > 0) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "Pengguna dan artikel terkait berhasil dihapus",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Pengguna gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

module.exports = {
  addUserHandler,
  getAllUsersHandler,
  searchUsersHandler,
  getUserByIdHandler,
  editUserProfileHandler,
  editUserPasswordHandler,
  editUserDescriptionsHandler,
  deleteUserByIdHandler,
};
