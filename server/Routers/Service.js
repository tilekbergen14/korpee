const router = require("express").Router();
const Service = require("../Models/Service");
const authorization = require("../Middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    const { name, price, spending, id } = req.body;

    if (id) {
      const updatedItem = await Service.findByIdAndUpdate(
        id,
        { name, price, spending },
        { new: true }
      );

      if (!updatedItem) return res.status(404).json("Item not found!");

      return res.json(updatedItem);
    }

    const newItem = await Service.create({ name, price, spending });
    return res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Service.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
