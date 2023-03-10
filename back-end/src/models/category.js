const mongoose = require("mongoose");

//--------------------Category Model------------------------//
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    href: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
