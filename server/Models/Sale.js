const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.ObjectId,
      required: false,
      ref: "Item",
    },
    service: {
      type: mongoose.ObjectId,
      required: false,
      ref: "Service",
    },
    material: {
      type: mongoose.ObjectId,
      required: false,
      ref: "Material",
    },
    case: {
        type: mongoose.ObjectId,
        required: false,
        ref: "Case",
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;