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
      fullName,
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

    const trimmedFullName = removeExtraSpaces(fullName);
    const trimmedUsername = removeExtraSpaces(username.toLowerCase());
    const trimmedEmail = removeExtraSpaces(email);
    const trimmedPassword = removeExtraSpaces(password);

    // Validation checks for empty fields
    if (
      !trimmedFullName ||
      !trimmedUsername ||
      !trimmedEmail ||
      !trimmedPassword
    ) {
      return h
        .response({
          status: "fail",
          message: "Username, email, and password are required",
        })
        .code(400);
    }

    // Validation for minimum and maximum length of fullName
    const fullNameMinLength = 3;
    const fullNameMaxLength = 50;
    if (
      trimmedFullName.length < fullNameMinLength ||
      trimmedFullName.length > fullNameMaxLength
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
      trimmedUsername.length < usernameMinLength ||
      trimmedUsername.length > usernameMaxLength
    ) {
      return h
        .response({
          status: "fail",
          message: `Username must be between ${usernameMinLength} and ${usernameMaxLength} characters.`,
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

    // Additional validation for username (Only letters, numbers, and underscores are allowed)
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return h
        .response({
          status: "fail",
          message:
            "Invalid username. Please use only letters, numbers, underscores, or periods.",
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

    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return h
        .response({
          status: "fail",
          message: "Invalid email format. Please enter a valid email address.",
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
        fullName: trimmedFullName,
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
          message:
            "Account registration is complete. Sign in now and explore our platform.",
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
