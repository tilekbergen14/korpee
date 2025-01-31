const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
    },
    imgUrl: { type: String },
    readtime: { type: String, trim: true },
    tags: [String],
    author_id: { type: mongoose.ObjectId, required: true },
    likes: [mongoose.ObjectId],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", schema);

module.exports = Post;
