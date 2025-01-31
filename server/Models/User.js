const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: [true, "This username is already used!"],
      maxLength: [30, "Username must be at most 30 chars!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "This username is already used!"],
    },
    password: { type: String, required: [true, "Password is required!"] },
    profileImg: { type: String },
    questions: [String],
    isAdmin: Boolean,
    confirmed: Boolean,
  })
);

module.exports = User;
