const Comment = require("../model/commentModel");

const writeComment = async (req, res, next) => {
  const { postId, comment } = req.body;
  const thoughts = new Comment({
    post: postId,
    user: req.user.userId,
    comment,
  });

  await thoughts.save();
  res.status(200).send(thoughts);
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
