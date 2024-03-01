const User = require("../model/userModel");
const aws = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
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
  const { name, email, password, user_name, image } = req.body;

  try {
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const userByUsername = await User.findOne({ user_name });
    if (userByUsername) {
      return res.status(400).json({ error: "User with this user name exists" });
    }

    let imageUrl = image || "https://aezashiva.s3.amazonaws.com/rocket.png";
    try {
      const result = await s3Uploadv2(req.file);
      imageUrl = result.Location;
    } catch (e) {
      console.log("error occured");
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
    return res.status(200).send(saveUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to sign up" });
  }
};
module.exports = { signUp, upload };
