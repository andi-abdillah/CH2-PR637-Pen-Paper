const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const secretKey = process.env.secretKey;

const createToken = (user) =>
  jwt.sign(
    {
      userId: user.userId,
    },
    secretKey,
    { algorithm: "HS256" }
  );

module.exports = createToken;
