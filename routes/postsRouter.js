const express = require("express");
const {
  createPost,
  upload,
  getAllPosts,
  getPostById,
} = require("../controller/postsController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/create", auth, upload.single("image"), createPost);
router.get("/getPosts", auth, getAllPosts);
router.get("/getPosts/:id", auth, getPostById);

module.exports = router;
