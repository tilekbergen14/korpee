const mongoose = require("mongoose");

const Question = mongoose.model(
  "Question",
  mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
        required: true,
      },
      body: {
        type: Map,
      },
      tags: [String],
      author_id: { type: mongoose.ObjectId, required: true },
      likes: [mongoose.ObjectId],
      answers: [mongoose.ObjectId],
    },
    { timestamps: true }
  )
);

module.exports = Question;
