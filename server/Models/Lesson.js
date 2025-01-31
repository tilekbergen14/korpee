const mongoose = require("mongoose");

const Lesson = mongoose.model(
  "Lesson",
  mongoose.Schema(
    {
      slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
      },
      title: {
        type: String,
        trim: true,
        required: true,
      },
      description: {
        type: String,
      },
      price: {
        type: String,
      },
      imgUrl: { type: String },
      author_id: { type: mongoose.ObjectId, required: true },
      blocks: [mongoose.ObjectId],
      published: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

module.exports = Lesson;
