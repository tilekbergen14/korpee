const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

router.get("/email/:token", async (req, res) => {
  const verifyToken = req.params.token;
  try {
    const { id } = await jwt.verify(verifyToken, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(id, { confirmed: true });
    const token = await jwt.sign(
      {
        username: user.username,
        password: user.password,
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    user &&
      res.json({
        username: user.username,
        token,
        role: user.isAdmin ? "admin" : "user",
        imgUrl: user.imgUrl,
        id: user._id,
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
