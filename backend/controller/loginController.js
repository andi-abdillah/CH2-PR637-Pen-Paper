const { User } = require("../models");
const bcrypt = require("bcrypt");
const createToken = require("./utils/createToken");

const loginHandler = async (request, h) => {
  try {
    const { email, password } = request.payload;

    // Find user based on email
    const user = await User.findOne({
      where: { email },
    });

    // If user is not found, return error message
    if (!user) {
      return h
        .response({
          status: "fail",
          message: "These credentials do not match our records",
        })
        .code(401);
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is not valid, return error message
    if (!isPasswordValid) {
      return h
        .response({
          status: "fail",
          message: "These credentials do not match our records",
        })
        .code(401);
    }

    const payload = {
      userId: user.userId,
      username: user.username,
    };

    const token = createToken(payload);

    // Successful login, return success response
    return h
      .response({
        status: "success",
        message: "Login successful",
        token,
      })
      .code(200);
  } catch (error) {
    // Handle errors
    console.error("Error in loginHandler:", error);
    return h
      .response({
        status: "error",
        message: "Internal server error.",
      })
      .code(500);
  }
};

module.exports = loginHandler;
