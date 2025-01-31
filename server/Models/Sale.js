const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    item: {
      type: mongoose.ObjectId,
      required: false,
    },
    service: {
      type: mongoose.ObjectId,
      required: false,
    },
    material: {
      type: mongoose.ObjectId,
      required: false,
    },
    case: {
        type: mongoose.ObjectId,
        required: false,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;