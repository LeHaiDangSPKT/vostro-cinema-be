const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Bill = new Schema(
  {
    userId: { type: String },
    filmId: { type: String },
    filmName: { type: String },
    theaterId: { type: String },
    showtime: { type: String },
    price: { type: Number },
    seat: { type: Array },
    roomName: { type: String },
    service: [
      {
        name: { type: String },
        quantity: { type: Number },
      },
    ],
    promotion: { type: String },
    state: { type: Number, default: 1 },
    //0: đã thanh toán
    //1: chưa thanh toán
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bill", Bill);
