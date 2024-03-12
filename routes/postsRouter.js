const express = require("express");
const {
  createPost,
  upload,
  getAllPosts,
  getPostById,
  getAllPostsofAUser,
} = require("../controller/postsController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/create", auth, upload.single("image"), createPost);
router.get("/getAllPosts", auth, getAllPosts);
router.get("/getPosts/:id", auth, getPostById);
router.get("/getAllPosts/:userId", auth, getAllPostsofAUser);

module.exports = router;
