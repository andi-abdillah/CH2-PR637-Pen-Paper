const { nanoid } = require("nanoid");
const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const formattedDate = require("./utils/formattedDate");

// Function to generate a unique user ID
const generateId = () => `user-${nanoid(20)}`;

const registerHandler = async (request, h) => {
  const t = await sequelize.transaction();

  try {
    // Generate a unique user ID
    const id = generateId();

    // Destructure payload and provide default values
    const {
      userId = id,
      username,
      email,
      password,
      descriptions,
      createdAt = formattedDate,
      updatedAt = formattedDate,
    } = request.payload;

    const removeExtraSpaces = (inputString) => {
      return inputString.replace(/\s+/g, " ").trim();
    };

    const trimmedUsername = removeExtraSpaces(username);
    const trimmedEmail = removeExtraSpaces(email);
    const trimmedPassword = removeExtraSpaces(password);

    // Validation checks for empty fields
    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      return h
        .response({
          status: "fail",
          message: "Username, email, and password are required",
        })
        .code(400);
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({
      where: { username: trimmedUsername },
    });

    if (existingUsername) {
      return h
        .response({
          status: "fail",
          message: "Username is already taken. Please choose a different one.",
        })
        .code(400);
    }

    // Check if email is already taken
    const existingEmail = await User.findOne({
      where: { email: trimmedEmail },
    });
    if (existingEmail) {
      return h
        .response({
          status: "fail",
          message: "Email is already registered. Please use a different email.",
        })
        .code(400);
    }

    // Password length validation
    if (trimmedPassword.length < 8) {
      return h
        .response({
          status: "fail",
          message: "Password must be at least 8 characters long.",
        })
        .code(400);
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(trimmedPassword)) {
      return h
        .response({
          status: "fail",
          message:
            "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.",
        })
        .code(400);
    }

    // Encrypt password before saving it
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Create a new user with the encrypted password
    const createdUser = await User.create(
      {
        userId,
        username: trimmedUsername,
        email: trimmedEmail,
        password: hashedPassword,
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
          message: "User successfully added.",
          data: { userId },
        })
        .code(201);
    }

    await t.rollback();
    return h
      .response({
        status: "fail",
        message: "Failed to add user.",
      })
      .code(500);
  } catch (error) {
    console.error(error);
    await t.rollback();
    return h
      .response({
        status: "error",
        message: "Internal server error.",
      })
      .code(500);
  }
};

module.exports = registerHandler;
