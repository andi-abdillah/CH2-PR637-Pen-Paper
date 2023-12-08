const { User } = require("../models");
const createToken = require("./utils/createToken");
const { OAuth2Client } = require("google-auth-library");

const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginWithOAuth = async (request, h) => {
  const { credential } = request.payload;
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user information from the verified token payload
    const payload = ticket.getPayload();
    const userEmail = payload.email;

    // Check if the user with the email exists in the database
    const user = await User.findOne({
      where: { email: userEmail },
    });

    if (user) {
      // If the user already exists, generate a token for the existing user
      const token = createToken(user);

      return h
        .response({
          status: "success",
          message: "Sign in successful",
          token,
        })
        .code(200);
    }

    return h
      .response({
        status: "fail",
        message: "Your Google account is not registered yet. Please sign up!",
      })
      .code(401);
  } catch (error) {
    console.error("Error verifying Google token:", error);
    // Handle token verification error
    return h
      .response({
        status: "fail",
        message: "Invalid token",
      })
      .code(401);
  }
};

module.exports = loginWithOAuth;
