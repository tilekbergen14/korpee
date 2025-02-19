const router = require("express").Router();
const Lesson = require("../Models/Lesson");
const User = require("../Models/User");
const authorization = require("../Middlewares/Authenticaiton");
const Block = require("../Models/Block");
const Serie = require("../Models/Series");

router.post("/", authorization, async (req, res) => {
  try {
    let user = req.user;
    if (!user) return res.status(409).json("Bad request");
    user = await User.findById(user.id);
    if (!user) return res.status(409).json("Bad request");
    if (!user.isAdmin) return res.status(409).json("Bad request");
    const { lessonId, blockTitle, position } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson)
      return res.status(404).json("Lesson doesn't exist by this id!");
    const block = await Block.create({
      title: blockTitle,
    });
    if (position) {
      lesson.blocks.splice(position, 0, block._id);
    } else {
      lesson.blocks.push(block._id);
    }
    const result = await Lesson.findByIdAndUpdate(lessonId, lesson, {
      new: true,
    });
    res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
    console.log(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { serieId } = req.query;
    const blockId = req.params.id;
    await Serie.findByIdAndDelete(serieId);
    const block = await Block.findById(blockId);
    const series = block.series.filter(
      (serie) => JSON.stringify(serie._id) !== JSON.stringify(serieId)
    );

    const result = await Block.findByIdAndUpdate(
      blockId,
      { series: series },
      { new: true }
    );
    res.json("Successfully deleted!");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong!");
  }
});

router.put("/", authorization, async (req, res) => {
  try {
    let user = req.user;
    if (!user) return res.status(409).json("Bad request");
    user = await User.findById(user.id);
    if (!user) return res.status(409).json("Bad request");
    if (!user.isAdmin) return res.status(409).json("Bad request");
    const { lessonId, blockTitle, position, blockId } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson)
      return res.status(404).json("Lesson doesn't exist by this id!");
    const block = await Block.findByIdAndUpdate(blockId, {
      title: blockTitle,
    });
    if (position) {
      lesson.blocks = lesson.blocks.filter(
        (e) => JSON.stringify(e._id) !== JSON.stringify(block._id)
      );
      lesson.blocks.splice(position - 1, 0, block._id);
    } else {
      lesson.blocks.push(block._id);
    }
    const result = await Lesson.findByIdAndUpdate(lessonId, lesson, {
      new: true,
    });

    res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
    console.log(err.message);
  }
});

module.exports = router;
