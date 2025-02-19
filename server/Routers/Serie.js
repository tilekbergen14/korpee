const router = require("express").Router();
const Lesson = require("../Models/Lesson");
const User = require("../Models/User");
const authorization = require("../Middlewares/Authenticaiton");
const Serie = require("../Models/Series");
const Block = require("../Models/Block");

router.post("/", authorization, async (req, res) => {
  try {
    let user = req.user;
    if (!user) return res.status(409).json("Bad request");
    user = await User.findById(user.id);
    if (!user) return res.status(409).json("Bad request");
    if (!user.isAdmin) return res.status(409).json("Bad request");
    const { blockId, title, body, position } = req.body;
    const block = await Block.findById(blockId);
    if (!block) return res.status(404).json("Block doesn't exist by this id!");
    if (block.series.includes(title))
      return res.status(404).json("By this name serie exists in this course!");
    const serie = await Serie.create({
      title,
      body,
    });

    if (position) {
      block.series.splice(position - 1, 0, serie._id);
    } else {
      block.series.push(serie._id);
    }

    await Block.findByIdAndUpdate(blockId, block, {
      new: true,
    });

    res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
    console.log(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const serieId = req.params.id;
    const serie = await Serie.findById(serieId);
    if (!serie) return res.status(404).json("Couldn't find serie!");
    res.json(serie);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Something went wrong!");
  }
});
module.exports = router;
