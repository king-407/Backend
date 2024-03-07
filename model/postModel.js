const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  content: {
    type: String,
  },
  title: {
    type: String,
  },
  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Comment",
  //   },
  // ],
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Post", postSchema);
