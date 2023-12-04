const { User } = require("../../models");

const validate = async (decoded) => {
  const user = await User.findByPk(decoded.userId);

  if (user) {
    return { isValid: true };
  }

  return { isValid: false };
};

module.exports = validate;
