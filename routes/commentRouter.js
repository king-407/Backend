const express = require("express");
const {
  getAllCommentsOfaPost,
  writeComment,
} = require("../controller/commentsController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/writeComment", auth, writeComment);
router.get("/getAllCommentsOfaPost/:postId", getAllCommentsOfaPost);

module.exports = router;
