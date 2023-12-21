const { Op } = require("sequelize");
const {
  User,
  Article,
  Like,
  Bookmark,
  Comment,
  sequelize,
} = require("../models");
const bcrypt = require("bcrypt");
const formattedDate = require("./utils/formattedDate");

// Handler to get all users
const getAllUsersHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    // Find all users and order by creation date in descending order
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        userId: {
          [Op.ne]: tokenUserId, // Filter out the current user
        },
      },
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
      fullName: user.fullName,
      username: user.username,
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

// Handler to search users based on a query string
const searchUsersHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials;

  try {
    const { query } = request.query;

    // Define search condition based on the query string
    const searchCondition = query
      ? {
          userId: { [Op.ne]: tokenUserId },
          username: { [Op.like]: `%${query}%` },
        }
      : { userId: { [Op.ne]: tokenUserId } };

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
      fullName: user.fullName,
      username: user.username,
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
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token
  const { userId: paramUserId } = request.params;

  // Check if the user is authorized to find the profile
  if (tokenUserId !== paramUserId) {
    return h
      .response({
        status: "fail",
        message: "Not authorized to find this profile",
      })
      .code(403); // 403 Forbidden
  }

  const targetUser = await User.findByPk(tokenUserId);

  if (targetUser) {
    return h
      .response({
        status: "success",
        data: {
          user: {
            userId: targetUser.userId,
            fullName: targetUser.fullName,
            username: targetUser.username,
            email: targetUser.email,
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

// Handler to get a user by username
const getUserByUsernameHandler = async (request, h) => {
  try {
    const { username } = request.params;
    const targetUser = await User.findOne({ where: { username } });

    if (targetUser) {
      return h
        .response({
          status: "success",
          data: {
            user: {
              userId: targetUser.userId,
              fullName: targetUser.fullName,
              username: targetUser.username,
              email: targetUser.email,
              descriptions: targetUser.descriptions,
              createdAt: targetUser.createdAt,
              updatedAt: targetUser.updatedAt,
            },
          },
        })
        .code(200);
    } else {
      return h
        .response({
          status: "fail",
          message: "User not found",
        })
        .code(404);
    }
  } catch (error) {
    console.error("Error retrieving user by username:", error);
    return h
      .response({
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
};

// Handler to edit a user's profile
const editUserProfileHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token
  const { userId: paramUserId } = request.params;
  const { fullName, username, email, descriptions } = request.payload;

  // Check if the user is authorized to edit the profile
  if (tokenUserId !== paramUserId) {
    return h
      .response({
        status: "fail",
        message: "Not authorized to edit this profile",
      })
      .code(403); // 403 Forbidden
  }

  // Validation for required fields
  if (!fullName || !username || !email) {
    return h
      .response({
        status: "fail",
        message:
          "Failed to update user profile. Please fill in all required fields.",
      })
      .code(400);
  }

  // Validation for minimum and maximum length of fullName
  const fullNameMinLength = 3;
  const fullNameMaxLength = 50;
  if (
    fullName.length < fullNameMinLength ||
    fullName.length > fullNameMaxLength
  ) {
    return h
      .response({
        status: "fail",
        message: `Full Name must be between ${fullNameMinLength} and ${fullNameMaxLength} characters.`,
      })
      .code(400);
  }

  // Validation for minimum and maximum length of username
  const usernameMinLength = 3;
  const usernameMaxLength = 20;
  if (
    username.length < usernameMinLength ||
    username.length > usernameMaxLength
  ) {
    return h
      .response({
        status: "fail",
        message: `Username must be between ${usernameMinLength} and ${usernameMaxLength} characters.`,
      })
      .code(400);
  }

  // Additional validation for username (Only letters, numbers, and underscores are allowed)
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  if (!usernameRegex.test(username)) {
    return h
      .response({
        status: "fail",
        message:
          "Invalid username. Please use only letters, numbers, underscores, or periods.",
      })
      .code(400);
  }

  // Check if the new username is already taken by another user
  const existingUsername = await User.findOne({
    where: {
      username,
      userId: {
        [Op.not]: paramUserId,
      },
    },
  });

  if (existingUsername) {
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
        [Op.not]: paramUserId,
      },
    },
  });

  if (existingEmail) {
    return h
      .response({
        status: "fail",
        message:
          "Failed to update user profile. Email is already registered by another user.",
      })
      .code(400);
  }

  // Email format validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return h
      .response({
        status: "fail",
        message: "Invalid email format. Please enter a valid email address.",
      })
      .code(400);
  }

  const t = await sequelize.transaction();

  try {
    // Update user profile
    const [, updatedRowCount] = await User.update(
      {
        fullName,
        username,
        email,
        descriptions,
        updatedAt: formattedDate(),
      },
      { where: { userId: paramUserId }, returning: true, transaction: t }
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
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token
  const { userId: paramUserId } = request.params;
  const { currentPassword, newPassword, confirmPassword } = request.payload;

  // Check if the user is authorized to edit the password
  if (tokenUserId !== paramUserId) {
    return h
      .response({
        status: "fail",
        message: "Not authorized to edit this password",
      })
      .code(403); // 403 Forbidden
  }

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

  const t = await sequelize.transaction();

  try {
    // Find the target user
    const targetUser = await User.findByPk(paramUserId);

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
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message:
            "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.",
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
    const [, updatedRowCount] = await User.update(
      {
        password: hashedPassword,
        updatedAt: formattedDate(),
      },
      { where: { userId: paramUserId }, returning: true, transaction: t }
    );

    await t.commit();

    if (updatedRowCount > 0) {
      return h
        .response({
          status: "success",
          message: "User password successfully updated",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to update user password. User ID not found",
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

// Handler to edit a user's descriptions
const editUserDescriptionsHandler = async (request, h) => {
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token
  const { userId: paramUserId } = request.params;
  const { descriptions } = request.payload;

  // Check if the user is authorized to edit the descriptions
  if (tokenUserId !== paramUserId) {
    return h
      .response({
        status: "fail",
        message: "Not authorized to edit these descriptions",
      })
      .code(403); // 403 Forbidden
  }

  const t = await sequelize.transaction();

  try {
    // Update user descriptions
    const [, updatedRowCount] = await User.update(
      {
        descriptions: descriptions.trim(),
        updatedAt: formattedDate(),
      },
      { where: { userId: paramUserId }, returning: true, transaction: t }
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
  const { userId: tokenUserId } = request.auth.credentials; // Extract userId from the token
  const { userId: paramUserId } = request.params;
  const { password } = request.payload;

  // Check if the user is authorized to delete the user
  if (tokenUserId !== paramUserId) {
    return h
      .response({
        status: "fail",
        message: "Not authorized to delete this user",
      })
      .code(403); // 403 Forbidden
  }

  const t = await sequelize.transaction();

  try {
    // Find the target user
    const targetUser = await User.findByPk(paramUserId);

    if (!targetUser) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to delete account. User ID not found",
        })
        .code(404);
    }

    // Validation for the required field
    if (!password) {
      return h
        .response({
          status: "fail",
          message:
            "Failed to delete account. Please provide your password to confirm the account deletion.",
        })
        .code(400);
    }

    // Validate if the provided password matches the user's password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, targetUser.password);

    if (!isPasswordValid) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "Failed to delete account. Incorrect password",
        })
        .code(400);
    }

    // Delete user
    const deletedUserRowCount = await User.destroy({
      where: { userId: paramUserId },
      transaction: t,
    });

    // Delete articles related to the user
    await Article.destroy({
      where: { userId: paramUserId },
      transaction: t,
    });

    // Delete likes associated with the user
    await Like.destroy({
      where: { userId: paramUserId },
      transaction: t,
    });

    // Delete bookmarks associated with the user
    await Bookmark.destroy({
      where: { userId: paramUserId },
      transaction: t,
    });

    // Delete comments associated with the user
    await Comment.destroy({
      where: { userId: paramUserId },
      transaction: t,
    });

    if (deletedUserRowCount > 0) {
      await t.commit();
      return h
        .response({
          status: "success",
          message:
            "Your account and all related resources successfully deleted",
        })
        .code(200);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to delete account. User ID not found",
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
  getUserByUsernameHandler,
  editUserProfileHandler,
  editUserPasswordHandler,
  editUserDescriptionsHandler,
  deleteUserByIdHandler,
};
