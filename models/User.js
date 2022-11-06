const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    dateOfBirthday: { type: Date },
    username: { type: String },
    password: { type: String },
    state: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", User);
