const nodemailer = require("nodemailer");
const sendOTPforPassword = async (email, verification_code) => {
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
      subject: `Welcome to Large`,
      html: `Your otp is ${verification_code} don;t share it with anyone `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).jso({ success: true, msg: "OTP is sent to email" });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendOTPforPassword;
