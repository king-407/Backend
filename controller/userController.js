const User = require("../model/userModel");
const aws = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const sendWelcommeEmail = require("../utils/sendWelcomeEmail");
const sendOTPforPassword = require("../utils/sendOTPforPassword");
const s3Uploadv2 = require("../utils/s3-service");

dotenv.config();

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("file is not of correct type"), false);
  }
};
const upload = multer({ storage, fileFilter, limits: 1000000 });

const signUp = async (req, res, next) => {
  const { name, email, password, user_name } = req.body;
  console.log(req.file);
  if (!name || !email || !password || !user_name)
    next("Please fill all the data");
  if (email == "") next("Please fill all the data");

  try {
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return next("User with this email exists");
    }

    const userByUsername = await User.findOne({ user_name });
    if (userByUsername) {
      return next("User name exists");
    }

    let imageUrl = "https://aezashiva.s3.amazonaws.com/rocket.png";

    if (req.file) {
      const result = await s3Uploadv2(req.file);
      imageUrl = result.Location;
    }
    const saveUser = new User({
      name,
      email,
      password,
      user_name,
      image: imageUrl,
    });

    console.log(saveUser);
    await saveUser.save();

    // await sendWelcommeEmail(saveUser.name, saveUser.email);
    return res.status(200).json({
      success: true,
      msg: "Your account has been created successfully",
    });
  } catch (err) {
    console.log(err);
    next("Failed to signup");
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await user.comparePassword(password);
      console.log(isMatch);
      if (!isMatch) {
        return next("invalid credentials");
      }
    } else return next("Invalid credentials");
    const token = user.createJWT();
    return res.status(200).json({ success: true, user, token });
  } catch (e) {
    next(e);
  }
};

const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const verification_code = Math.floor(Math.random() * 900000) + 100000;
    const check_email = await User.findOne({ email });
    if (!check_email) {
      return next("No user with this email exists");
    }
    await sendOTPforPassword(email, verification_code);
  } catch (e) {
    console.log(e);
  }
};

module.exports = { signUp, upload, login, sendOTP };
