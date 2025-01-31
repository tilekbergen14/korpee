const mongoose = require("mongoose");

const Block = mongoose.model(
  "Block",
  mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
        require,
      },
      series: [mongoose.ObjectId],
    },
    { timestamps: true }
  )
);

module.exports = Block;
