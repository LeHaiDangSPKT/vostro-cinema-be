const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Showtime = new Schema(
  {
    theaterId: { type: String },
    filmId: { type: String },
    filmName: { type: String },
    roomName: { type: String },
    movieDate: { type: Date },
    movieTime: [
      {
        state: { type: Number, default: 2 },
        time: { type: Number },
      },
    ],
    duration: { type: Number },
    //2: lên lịch
    //1: mở bán
    //0: qua
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("showtime", Showtime);
