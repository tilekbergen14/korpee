const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorization = require("../Middlewares/Authenticaiton");
const nodemailer = require("../functions/nodemailer");

router.get("/:id", authorization, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.json({
      username: user.username,
      profile: user.profileImg,
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json("Something went wrog");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    let user = null;
    const userEmail = await User.findOne({ email: emailOrUsername });
    const userName = await User.findOne({
      username: emailOrUsername,
    });
    if (userEmail) {
      user = userEmail;
    }
    if (userName) {
      user = userName;
    }
    if (!user) return res.status(403).send("Couldnt find user!");
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!user.confirmed)
      return res.status(403).send("Please verify your email!");
    if (!passwordMatches) return res.status(403).send("Wrong password!");
    const token = await jwt.sign(
      {
        username: user.username,
        password: user.password,
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    res.json({
      username: user.username,
      token,
      role: user.isAdmin ? "admin" : "user",
      imgUrl: user.imgUrl,
      id: user._id,
    });
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, password2 } = req.body;
  try {
    const emailUser = await User.findOne({ email });
    if (emailUser)
        return res.status(200).send("This email is already used!");
    if (await User.findOne({ username }))
      return res.status(403).send("This username is already used!");
    if (password !== password2)
      return res.status(403).send("Passwords doesn't match!");

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      confirmed: false,
    });

    const token = await jwt.sign(
      {
        username: user.username,
        password: user.password,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // const emailSent = await nodemailer({
    //   sendto: email,
    //   html: `<a href='http://localhost:3000/verify/email/${token}'>Verify your email!</a>`,
    // });
    res.json("Please verify your email, chech your inbox!");
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
});

router.put("/", authorization, async (req, res) => {
  try {
    const info = req.body;
    const user = req.user;
    const result = await User.findByIdAndUpdate(user.id, info, { new: true });
    result && res.json("updated");
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

router.post("/forgetpassword", async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(401).json("Please enter email!");
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json("User does not exist with this email!");
    const token = await jwt.sign(
      {
        username: user.username,
        password: user.password,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const emailSent = await nodemailer({
      sendto: email,
      html: `<a href='http://localhost:3000/changepassword/${token}'>Change your password!</a>`,
    });
    emailSent && res.json("Please check your email!");
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
});

router.post("/changepassword/:token", async (req, res) => {
  try {
    const verifyToken = req.params.token;
    const { newpassword, newpassword2 } = req.body;
    const { id } = await jwt.verify(verifyToken, process.env.JWT_SECRET);

    if (newpassword && id) {
      if (newpassword !== newpassword2)
        return req.status(400).send("Passwords doesn't match!");
      const hashedPass = await bcrypt.hash(newpassword, 10);
      const user = await User.findByIdAndUpdate(id, { password: hashedPass });
      if (user) {
        res.json("Password changed successfully!");
      }
    } else {
      res.json("Rigth token!");
    }
  } catch (err) {
    res.status(500).json("Something went wrog");
  }
});

module.exports = router;
