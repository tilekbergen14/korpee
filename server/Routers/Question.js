const Question = require("../Models/Question");
const router = require("express").Router();
const authentication = require("../Middlewares/Authenticaiton");
const User = require("../Models/User");
const strToTagsArr = require("../functions/strToTagsArr");
const Answer = require("../Models/Answer");
const sort = require("../functions/sort");

router.post("/", authentication, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const tagsArr = tags && strToTagsArr(tags);
    const question = await Question.create({
      title,
      body,
      tags: tagsArr,
      author_id: req.user.id,
    });
    if (question) return res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Question.findByIdAndDelete(id);
    await Answer.findOneAndDelete({ question_id: id });

    res.json("deleted");
  } catch (error) {
    res.status(500).json("Something went wrong!");
  }
});
router.post("/like", authentication, async (req, res) => {
  try {
    const questionId = req.body.id;
    const _id = req.user.id;
    const question = await Question.findById(questionId);
    const liked = question.likes.includes(_id);
    if (liked) {
      question.likes = question.likes.filter(
        (like) => JSON.stringify(like) !== JSON.stringify(_id)
      );
    } else {
      question.likes.push(_id);
    }
    await Question.findByIdAndUpdate(questionId, question, {
      new: true,
    });
    res.status(200).send("reacted");
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.get("/", async (req, res) => {
  const offset = req.query.offset ? req.query.offset : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const category = req.query?.category;
  let questions;
  if (category === "top") {
    const result = await Question.find({})
      .sort({ likes: -1 })
      .skip(parseInt(offset))
      .limit(limit);
    questions = result;
  } else {
    questions = await Question.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(limit);
  }
  const newquestions = await Promise.all(
    questions.map(async (question) => {
      try {
        if (question.author_id) {
          const user = await User.findById(question.author_id);
          const userInfo = {
            author_id: user._id,
            author: user.username,
            authorProfile: user.profileImg,
          };
          const userLiked = question.likes.includes(user._id);
          if (user)
            return {
              id: question._id,
              title: question.title,
              tags: question.tags,
              createdAt: question.createdAt,
              likes: question.likes.length,
              userLiked: userLiked,
              ...userInfo,
            };
        }
      } catch (err) {
        res.status(500).json("Something went wrong");
      }
    })
  );
  res.json(newquestions);
});

router.get("/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    const user = await User.findById(question.author_id);
    const userInfo = {
      author_id: user._id,
      author: user.username,
      authorProfile: user.profileImg,
    };
    const answers = await Answer.find({ question_id: question.id });
    const newAnswers = await Promise.all(
      answers.map(async (answer) => {
        const author = await User.findById(answer.author_id);
        const userLiked = answer.likes.includes(user._id);
        const likes = answer.likes.length;
        return {
          id: answer._id,
          body: answer.body,
          createdAt: answer.createdAt,
          author_id: answer.author_id,
          author: author.username,
          authorProfile: author.profileImg,
          userLiked: userLiked,
          likes: likes,
        };
      })
    );
    const userLiked = question.likes.includes(user._id);
    if (question)
      res.json({
        id: question._id,
        title: question.title,
        createdAt: question.createdAt,
        likes: question.likes.length,
        userLiked: userLiked,
        body: question.body,
        answers: newAnswers,
        ...userInfo,
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Something went wrong!");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const question = await Question.findByIdAndUpdate(id, body, { new: true });
    question && res.json("updated");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/getuserquestions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const questions = await Question.find({ author_id: id });
    res.json(questions);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong?");
  }
});

module.exports = router;
