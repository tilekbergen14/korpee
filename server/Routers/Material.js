const router = require("express").Router();
const Material = require("../Models/Material");
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

      const updatedMaterial = await Material.findByIdAndUpdate(
        id,
        { name, price, total: newTotal },
        { new: true }
      );

      if (!updatedMaterial) return res.status(404).json("Material not found!");

      return res.json(updatedMaterial);
    }

    const newItem = await Material.create({ name, price, total });
    return res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Material.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
