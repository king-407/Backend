const nodemailer = require("nodemailer");
const sendWelcommeEmail = async (name, email) => {
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
      from: "shivamtiwaritiwari0704@gmail.com",
      to: email,
      subject: `Welcome to Large`,
      html: `Hey ${name} welcome to Large 🏆 We are happy to see you . We hope that you will get some great experience in  this platform. We will love to hear your feedback `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("mail sent successfully" + info);
      }
    });
  } catch (e) {}
};

module.exports = sendWelcommeEmail;
