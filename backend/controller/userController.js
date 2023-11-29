const { nanoid } = require("nanoid");
const { User } = require("../models");

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

  try {
    await User.create({
      userId,
      username,
      email,
      password,
      descriptions,
      createdAt,
      updatedAt,
    });

    const createdUser = await User.findByPk(userId);

    if (createdUser) {
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

    return h
      .response({
        status: "error",
        message: "Pengguna gagal ditambahkan",
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

const getAllUsersHandler = async (request, h) => {
  try {
    const users = await User.findAll();

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

const editUserByIdHandler = async (request, h) => {
  const { userId } = request.params;
  const { username, email, password, descriptions } = request.payload;

  if (!username || !email || !password) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui pengguna. Mohon isi semua kolom yang diperlukan",
      })
      .code(400);
  }

  try {
    const [, updatedRowCount] = await User.update(
      {
        username,
        email,
        password,
        descriptions,
        updatedAt: new Date(),
      },
      { where: { userId }, returning: true }
    );

    if (updatedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Pengguna berhasil diperbarui",
        })
        .code(200);
    }

    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui pengguna. Id tidak ditemukan",
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

const deleteUserByIdHandler = async (request, h) => {
  const { userId } = request.params;

  try {
    const deletedRowCount = await User.destroy({ where: { userId } });

    if (deletedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "Pengguna berhasil dihapus",
        })
        .code(200);
    }

    return h
      .response({
        status: "fail",
        message: "Pengguna gagal dihapus. Id tidak ditemukan",
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
  addUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  editUserByIdHandler,
  deleteUserByIdHandler,
};
