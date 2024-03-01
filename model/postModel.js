const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Post", postSchema);