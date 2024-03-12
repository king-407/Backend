const User = require("../model/userModel");
const aws = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const sendWelcommeEmail = require("../utils/sendWelcomeEmail");
const sendOTPforPassword = require("../utils/sendOTPforPassword");
const s3Uploadv2 = require("../utils/s3-service");
const crypto = require("crypto");

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
    return next("Please fill all the data");
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

const sendToken = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next("No user with this email exists");
    }
    const resetToken = user.createPasswordToken();
    await user.save();

    const resetUrl = `${req.protocol}://localhost:3000/users/reset/${resetToken}`;
    try {
      await sendOTPforPassword(email, resetUrl, function (error) {
        if (error) {
          user.resetToken = null;
          user.passwordResetToken = null;
          user.passwordResetTokenExpires = null;
          user
            .save()
            .then(() => {
              return next("Failed to send reset email");
            })
            .catch(next);
        } else {
          res.status(200).json({
            success: true,
            msg: "Password reset link has been sent to your email",
          });
        }
      });
    } catch (e) {}
  } catch (e) {}
};

const changePassword = async (req, res, next) => {
  const { password } = req.body;
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next("Reset link has expired or is invalid");
    }
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    res.status(200).json({
      success: true,
      msg: "Your password has been changed successfully",
    });
  } catch (e) {
    console.log(e);
  }
};

const follow = async (req, res, next) => {
  const { personId } = req.body;
  const owner = req.user.userId;
  try {
    const recieve = await User.findByIdAndUpdate(personId, {
      $push: { followers: owner },
    });
    const sent = await User.findByIdAndUpdate(owner, {
      $push: { following: personId },
    });

    const celeb = await User.findOne({ _id: personId });
    const personName = celeb.user_name;

    res
      .status(200)
      .json({ success: true, msg: `You are now following ${personName}` });
  } catch (e) {}
};

const getUsers = async (req, res, next) => {
  try {
    const currentUser = req.user.userId;
    const users = await User.find({ _id: { $ne: currentUser } }).populate(
      "followers"
    );
    res.status(200).send(users);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  signUp,
  upload,
  login,
  sendToken,
  follow,
  getUsers,

  changePassword,
};
