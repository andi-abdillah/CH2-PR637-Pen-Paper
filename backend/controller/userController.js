const { Op } = require("sequelize");
const { User, Article, sequelize } = require("../models");
const bcrypt = require("bcrypt");

// Handler to get all users
const getAllUsersHandler = async (request, h) => {
  try {
    // Find all users and order by creation date in descending order
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });

    // If no users, return an empty array
    if (!users || users.length === 0) {
      return h
        .response({
          status: "success",
          data: { users: [] },
        })
        .code(200);
    }

    // Map users to a simplified format
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
        data: { users: listUsers },
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

// Handler to search users based on a query string
const searchUsersHandler = async (request, h) => {
  try {
    const { query } = request.query;

    // Define search condition based on the query string
    const searchCondition = query
      ? { username: { [Op.like]: `%${query}%` } }
      : {};

    // Find users matching the search condition
    const users = await User.findAll({
      where: searchCondition,
      order: [["createdAt", "DESC"]],
    });

    // If no users, return an empty array
    if (!users || users.length === 0) {
      return h
        .response({
          status: "success",
          data: { users: [] },
        })
        .code(200);
    }

    // Map users to a simplified format
    const listUsers = users.map((user) => ({
      userId: user.userId,
      username: user.username,
      password: user.password,
      email: user.email,
      descriptions: user.descriptions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return h
      .response({
        status: "success",
        data: { users: listUsers },
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

// Handler to get a user by ID
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
      message: "User not found",
    })
    .code(404);
};

// Handler to edit a user's profile
const editUserProfileHandler = async (request, h) => {
  const { userId } = request.params;
  const { username, email } = request.payload;

  // Validation for required fields
  if (!username || !email) {
    return h
      .response({
        status: "fail",
        message:
          "Failed to update user profile. Please fill in all required fields.",
      })
      .code(400);
  }

  const t = await sequelize.transaction();

  try {
    // Check if the new username is already taken by another user
    const existingUsername = await User.findOne({
      where: {
        username,
        userId: {
          [Op.not]: userId,
        },
      },
    });

    if (existingUsername) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Failed to update user profile. Username is already taken by another user.",
        })
        .code(400);
    }

    // Check if the new email is already registered by another user
    const existingEmail = await User.findOne({
      where: {
        email,
        userId: {
          [Op.not]: userId,
        },
      },
    });

    if (existingEmail) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Failed to update user profile. Email is already registered by another user.",
        })
        .code(400);
    }

    // Update user profile
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
          message: "User profile successfully updated",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to update user profile. User ID not found",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Handler to edit a user's password
const editUserPasswordHandler = async (request, h) => {
  const { userId } = request.params;
  const { currentPassword, newPassword, confirmPassword } = request.payload;

  // Validation for required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return h
      .response({
        status: "fail",
        message:
          "Failed to update user password. Please fill in all required fields.",
      })
      .code(400);
  }

  console.log("adaskdkmk");

  const t = await sequelize.transaction();

  try {
    // Find the target user
    const targetUser = await User.findByPk(userId);

    if (!targetUser) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to update user password. User ID not found",
        })
        .code(404);
    }

    // Validate if the current password matches the password in the database using bcrypt
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      targetUser.password
    );

    console.log(isPasswordValid);

    if (!isPasswordValid) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Failed to update user password. Current password is incorrect",
        })
        .code(400);
    }

    // Validate that the new password is not the same as the current password
    if (currentPassword === newPassword) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Failed to update user password. New password must be different from the current password",
        })
        .code(400);
    }

    // Validate password length
    if (newPassword.length < 8) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Failed to update user password. New password must be at least 8 characters long",
        })
        .code(400);
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Failed to update user password. Password confirmation does not match",
        })
        .code(400);
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password with hashed password
    await User.update(
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      { where: { userId }, transaction: t }
    );

    await t.commit();
    return h
      .response({
        status: "success",
        message: "User password successfully updated",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Handler to edit a user's descriptions
const editUserDescriptionsHandler = async (request, h) => {
  const { userId } = request.params;
  const { descriptions } = request.payload;

  const t = await sequelize.transaction();

  try {
    // Update user descriptions
    const [, updatedRowCount] = await User.update(
      {
        descriptions: descriptions.trim(),
        updatedAt: new Date(),
      },
      { where: { userId }, returning: true, transaction: t }
    );

    if (updatedRowCount > 0) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "User descriptions successfully updated",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to update user descriptions. User ID not found",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

// Handler to delete a user by ID
const deleteUserByIdHandler = async (request, h) => {
  const { userId } = request.params;

  const t = await sequelize.transaction();

  try {
    // Delete user
    const deletedUserRowCount = await User.destroy({
      where: { userId },
      transaction: t,
    });

    // Delete articles related to the user
    const deletedArticleRowCount = await Article.destroy({
      where: { userId },
      transaction: t,
    });

    if (deletedUserRowCount > 0) {
      await t.commit();
      return h
        .response({
          status: "success",
          message: "User and related articles successfully deleted",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to delete user. User ID not found",
      })
      .code(404);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "An error occurred on the server",
      })
      .code(500);
  }
};

module.exports = {
  getAllUsersHandler,
  searchUsersHandler,
  getUserByIdHandler,
  editUserProfileHandler,
  editUserPasswordHandler,
  editUserDescriptionsHandler,
  deleteUserByIdHandler,
};
