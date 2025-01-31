const router = require("express").Router();
const Material = require("../Models/Material");
const authorization = require("../middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    const { name, price, total, id } = req.body;

    if (id) {
      const updatedMaterial = await Material.findByIdAndUpdate(id, { name, price, total }, { new: true });

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
