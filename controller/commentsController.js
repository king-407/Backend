const Comment = require("../model/commentModel");

const writeComment = async (req, res, next) => {
  const { postId, comment } = req.body;
  if (!comment || comment == "") {
    return next("Comment cannot be empty");
  }
  const thoughts = new Comment({
    post: postId,
    user: req.user.userId,
    comment,
  });

  await thoughts.save();
  res.status(200).json({ success: true, msg: "Comment successfully created" });
};

const getAllCommentsOfaPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const comments = await Comment.find({ post: postId }).populate("user");
    res.status(200).send(comments);
  } catch (e) {
    console.log(e);
  }
};
module.exports = { getAllCommentsOfaPost, writeComment };
