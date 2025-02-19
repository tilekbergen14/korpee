const router = require("express").Router();
const Case = require("../Models/Case");
const authorization = require("../Middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    const { name, price, total, id } = req.body;

    if (id) {
      const updatedCase = await Case.findByIdAndUpdate(id, { name, price, total }, { new: true });

      if (!updatedCase) return res.status(404).json("Case not found!");

      return res.json(updatedCase); 
    }

    const newCase = await Case.create({ name, price, total });
    return res.json(newCase); 
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Case.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
