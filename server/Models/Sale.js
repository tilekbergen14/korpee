const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    sales: [
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
        weight: {
          type: Number,
          required: false,
        },
        length: {
          type: Number,
          required: false,
        },
        quantity: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;
