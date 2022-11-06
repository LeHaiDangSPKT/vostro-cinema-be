const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Service = new Schema({
  chair: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
  menu: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
});

module.exports = mongoose.model("service", Service);
