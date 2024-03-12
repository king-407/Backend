const nodemailer = require("nodemailer");
const sendOTPforPassword = async (email, resetUrl, callback) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "shivamtiwaritiwari0704@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: "Shivam Tiwari",
      to: email,
      subject: `Password reset mail`,
      html: `click on the link to reset your password ${resetUrl} `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        callback(error);
      } else {
        callback(null);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendOTPforPassword;
