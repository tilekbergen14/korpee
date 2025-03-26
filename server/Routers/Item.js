const router = require("express").Router();
const Item = require("../Models/Item");
const authorization = require("../Middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    const { name, price, total, id, adding } = req.body;

    if (id) {
      let newTotal = parseInt(total, 10);
      let addingInt = parseInt(adding, 10);

      if (!isNaN(newTotal) && !isNaN(addingInt)) {
        if (addingInt) {
          newTotal += addingInt;
        }
      }
      const updatedItem = await Item.findByIdAndUpdate(
        id,
        { name, price, total: newTotal },
        { new: true }
      );

      if (!updatedItem) return res.status(404).json("Item not found!");

      return res.json(updatedItem);
    }

    const newItem = await Item.create({ name, price, total });
    return res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
