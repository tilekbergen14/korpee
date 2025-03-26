const router = require("express").Router();
const Sale = require("../Models/Sale");
const authorization = require("../Middlewares/Authenticaiton");
const Material = require("../Models/Material");
const Case = require("../Models/Case");
const Item = require("../Models/Item");

router.post("/", authorization, async (req, res) => {
  try {
    const { client, total } = req.body;

    // Ensure orders array exists and has at least one order
    if (
      client &&
      Array.isArray(req.body.orders) &&
      req.body.orders.length > 0
    ) {
      // Find or create a Sale document for the client

      let sale = await Sale.create({
        name: client,
        total: total,
        sales: [], // Initialize sales array if no sale document found
      });

      // Loop through orders and add them to the sales array
      for (const order of req.body.orders) {
        sale.sales.push({
          item: order.item?._id,
          service: order.service?._id,
          material: order.material?._id,
          case: order.case?._id,
          weight: order.weight,
          length: order.lenght,
          quantity: order.quantity,
        });
        if (order.weight && order.material?._id) {
          const material = await Material.findById(order.material?._id);
          if (material) {
            material.total -= order.weight;
            await material.save();
          }
        }

        if (order.lenght && order.item?._id) {
          const item = await Item.findById(order.item?._id);
          if (item) {
            item.total -= order.lenght;
            await item.save();
          }
        }

        if (order.quantity && order.case?._id) {
          const caseItem = await Case.findById(order.case?._id);
          if (caseItem) {
            caseItem.total -= order.quantity;
            await caseItem.save();
          }
        }
      }

      await sale.save();

      return res.json({ message: "Sale created/updated successfully", sale });
    } else {
      return res.status(400).json({
        message: "Invalid request. Please provide valid orders and client.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Sale.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "sales.item",
        select: "name price",
      })
      .populate({
        path: "sales.service",
        select: "name price",
      })
      .populate({
        path: "sales.material",
        select: "name price",
      })
      .populate({
        path: "sales.case",
        select: "name price",
      });

    res.json(items);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
