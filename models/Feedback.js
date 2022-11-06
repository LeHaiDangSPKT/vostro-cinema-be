const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Feedback = new Schema(
  {
    userId: { type: String },
    name: { type: String },
    content: { type: String },
    mode: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("feedback", Feedback);
