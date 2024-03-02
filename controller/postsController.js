const aws = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
const s3Uploadv2 = require("../utils/imageUpload");
const Post = require("../model/postModel");
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

const createPost = async (req, res, next) => {
  const { content, title, image, category } = req.body;

  try {
    const result = await s3Uploadv2(req.file);
    imageUrl = result.Location;
  } catch (e) {
    console.log("error occured");
  }
  const post = new Post({
    content,
    title,
    image: imageUrl,
    category,
    user: req.user.userId,
  });
  await post.save();
  return res.status(200).json({ post });
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user");
    res.status(200).send(posts);
  } catch (e) {
    console.log("error");
  }
};

const getPostById = async (req, res, next) => {
  try {
    const posts = await Post.findOne({ _id: req.params.id }).populate("user");
    res.status(200).send(posts);
  } catch (e) {
    console.log("error");
  }
};
module.exports = { createPost, upload, getAllPosts, getPostById };
