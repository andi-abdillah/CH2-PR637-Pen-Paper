const nodemailer = require("nodemailer");
const { Entropy, charset32 } = require("entropy-string");
const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const formattedDate = require("./utils/formattedDate");

const sendResetPasswordMail = async (request, h) => {
  const { email } = request.payload;

  const account = {
    user: "penpaper.tech@gmail.com",
    pass: "slqgnkqvuahjpxlj",
  };

  // Create a Sequelize transaction
  const t = await sequelize.transaction();

  try {
    // Generate a random password using entropy-string
    const entropy = new Entropy({ bits: 60, charset: charset32 });
    const newPassword = entropy.string();

    // Get the user's name from the database
    const user = await User.findOne({
      attributes: ["username"],
      where: {
        email,
      },
      transaction: t,
    });

    if (!user) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "We can't find your account.",
        })
        .code(404);
    }

    // Encrypt password before updating it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const [, updatedRowCount] = await User.update(
      { password: hashedPassword, updatedAt: formattedDate },
      {
        where: {
          email,
        },
        returning: true,
        transaction: t,
      }
    );

    // If the user was not found, send a specific response
    if (updatedRowCount === 0) {
      await t.rollback();
      return h
        .response({
          status: "fail",
          message: "We can't find your account.",
        })
        .code(404);
    }

    // Configure the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Compose the email message
    const message = {
      from: '"Pen & Paper Team 🖊️📄" <penpaper.tech@gmail.com>',
      to: email,
      subject: "Your Password Has Been Reset ✔",
      html: `
        <p>Hello ${user?.username} 👋,</p>
        <p>Your password has been successfully reset to: <b>${newPassword}</b></p>
        <p>If you did not initiate this action, please contact our support team immediately.</p>
        <p>Thank you,</p>
        <p>Pen & Paper Team 🖊️📄</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(message);

    // Commit the transaction
    await t.commit();

    console.log("Message sent: %s", info.messageId);
    return h
      .response({
        status: "success",
        message:
          "Your password has been successfully reset. Please check your email for the new password.",
      })
      .code(200);
  } catch (error) {
    // Rollback the transaction if an error occurs
    await t.rollback();

    console.error(error);
    return h
      .response({
        status: "error",
        message: "Internal server error.",
      })
      .code(500);
  }
};

module.exports = sendResetPasswordMail;
