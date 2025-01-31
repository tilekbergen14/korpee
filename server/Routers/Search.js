const mongoose = require("mongoose");
const Post = require("../Models/Post");
const Question = require("../Models/Question");
const Lesson = require("../Models/Lesson");
const router = require("express")();

router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const limit = req.query.limit ? req.query.limit : 0;
    const offset = req.query.questions ? req.query.questions : 0;
    const posts = await Post.find(
      {
        $or: [
          {
            tags: { $regex: keyword, $options: "i" },
          },
          {
            title: { $regex: keyword, $options: "i" },
          },
        ],
      },
      "_id title readtime tags createdAt imgUrl"
    )
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    const lessons = await Lesson.find({
      title: { $regex: keyword, $options: "i" },
    })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    const questions = await Question.find({
      title: { $regex: keyword, $options: "i" },
    })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    res.json({ posts, lessons, questions });
  } catch (err) {
    res.status(500).json("Something went wrong!");
    console.log(err);
  }
});

module.exports = router;
