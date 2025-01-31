const router = require("express").Router();
const upload = require("../Middlewares/multer");

router.post("/", upload.single("file"), (req, res) => {
  if (req.file) {
    const imageUrl = req.file.destination + req.file.filename;
    res.json({ imageUrl });
  } else {
    res.json("Nothing");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const image = req.params.id;
    fs.unlink(`image/${image}`, () => {});
    res.json("deleted");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
