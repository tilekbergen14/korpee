const router = require("express").Router();
const Sale = require("../Models/Sale");
const authorization = require("../middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    const { id, item, service, material, case_id } = req.body;

    if (id) {
      const updated = await Sale.findByIdAndUpdate(id, { item, service, material, case_id }, { new: true });

      if (!updated) return res.status(404).json("Sale not found!");

      return res.json(updated); 
    }

    const newItem = await Sale.create({ item, service, material, case_id });
    return res.json(newItem); 
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong!");
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Sale.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
