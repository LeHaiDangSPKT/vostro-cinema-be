const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Ticket = new Schema(
  {
    UserId: { type: String },
    TypeOfChair: { type: String },
    NameOfChair: { type: String },
    Price: { type: Number },
    BuyingDay: { type: Date },
    TheaterId: { type: String },
    NameOfRoom: { type: String },
    NameOFFilm: { type: String },
    Showtime: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ticket", Ticket);
