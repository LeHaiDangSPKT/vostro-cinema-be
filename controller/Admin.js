const TheaterModel = require("../models/Theater");
const FilmModel = require("../models/Film");
const UserModel = require("../models/User");
const ServiceModel = require("../models/Service");
const ShowTimeModel = require("../models/Showtime");
const BillModel = require("../models/Bill");

class Admin {
  //[GET] /admin/getAllTheater
  getAllTheater(req, res, next) {
    TheaterModel.find({ state: true }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  // [GET] /admin/getOneTheaterById/:id
  getOneTheaterById(req, res, next) {
    TheaterModel.find({ _id: req.params.id, state: true }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }
  // [POST] /admin/addTheaterAndRoom
  addTheaterAndRoom(req, res, next) {
    TheaterModel.findOne({ name: req.body.name }, (err, result) => {
      if (result) {
        res.status(404).send("Rạp phim đã tồn tại");
      } else {
        const theater = req.body;
        const newTheater = new TheaterModel(theater);
        newTheater.save();
        res.json(theater);
      }
    });
  }

  //[UPDATE] /admin/deleteTheaterById/:id
  deleteTheaterById(req, res, next) {
    TheaterModel.updateOne({ _id: req.params.id }, { state: false })
      .then((result) => res.json(result))
      .catch(next);
  }

  //[PUT] /admin/updateTheaterById/:id
  updateTheaterById(req, res, next) {
    var theater = req.body;
    theater.room = req.body.room.map((item) => item);
    TheaterModel.updateOne({ _id: req.params.id }, theater)
      .then((result) => res.json(result))
      .catch(next);
  }

  // [GET] /admin/getNameAndIdAllTheater
  getNameAndIdAllTheater(req, res, next) {
    TheaterModel.find({ state: true }, { name: 1, room: 1 }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  // [POST] /admin/addFilm
  addFilm(req, res, next) {
    FilmModel.findOne({ name: req.body.name }, (err, result) => {
      if (result) {
        res.status(404).send("Phim đã tồn tại");
      } else {
        const film = req.body;
        const newFilm = new FilmModel(film);
        newFilm.save();
        res.json(film);
      }
    });
  }

  //[GET] /admin/getAllFilmsById/:id
  getAllFilmsById(req, res, next) {
    FilmModel.find({ theaterId: req.params.id, state: true }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  //[GET] /admin/getAllFilms
  getAllFilms(req, res, next) {
    FilmModel.find({ state: true }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  //[UPDATE] /admin/deleteFilmById/:id
  deleteFilmById(req, res, next) {
    FilmModel.updateOne({ _id: req.params.id }, { state: false })
      .then((result) => res.json(result))
      .catch(next);
  }

  //[UPDATE] /admin/updateFilmById/:id
  updateFilmById(req, res, next) {
    var film = req.body;
    film.category = req.body.category.map((item) => item);
    FilmModel.updateOne({ _id: req.params.id }, film)
      .then((result) => res.json(result))
      .catch(() => {
        res.status(404).send(`Không tìm thấy phim ${req.params.name}`);
      });
  }

  //[GET] /admin/getAllUsers
  getAllUsers(req, res, next) {
    UserModel.find({ state: true }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  // [UPDATE] //admin/deleteAccountById/:id
  deleteAccountById(req, res, next) {
    UserModel.updateOne({ _id: req.params.id }, { state: false })
      .then((result) => res.json(result))
      .catch(next);
  }

  //[GET] /admin/getChairService
  getChairService(req, res, next) {
    ServiceModel.find({}, { chair: 1 }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  //[PUT] /admin/updateChairServiceByName/:name
  updateChairServiceByName(req, res, next) {
    ServiceModel.updateOne(
      { "chair.name": req.body.name },
      { $set: { "chair.$.price": req.body.price } }
    )
      .then((result) => res.json(result))
      .catch(next);
  }

  //[GET] /admin/getMenuService
  getMenuService(req, res, next) {
    ServiceModel.find({}, { menu: 1 }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  //[PUT] /admin/updateMenuService/
  updateMenuService(req, res, next) {
    for (const item in req.body) {
      if (req.body[item] !== 0) {
        ServiceModel.updateOne(
          { "menu.name": item },
          { $set: { "menu.$.price": req.body[item] } }
        )
          .then((result) => res.json(result))
          .catch(next);
      }
    }
  }

  //[POST] /admin/addShowTime/
  addShowTime(req, res, next) {
    const showTime = req.body;
    const newshowTime = new ShowTimeModel(showTime);
    newshowTime.save();
    res.json(showTime);
  }

  //[POST] /admin/getOneShowTime
  getOneShowTime(req, res, next) {
    ShowTimeModel.findOne(
      {
        $and: [
          { theaterId: req.body.theaterId },
          { roomName: req.body.roomName },
          { movieDate: req.body.movieDate + "T00:00:00.000+00:00" },
        ],
      },

      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );
  }

  //[PUT] /admin/updateShowTime:id
  updateShowTime(req, res, next) {
    ShowTimeModel.updateOne(
      { _id: req.params.id },
      { $push: { movieTime: { $each: req.body.movieTime, $sort: 1 } } },
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );
  }

  //[GET] /admin/getAllShowTimesById/:id
  getAllShowTimesById(req, res, next) {
    ShowTimeModel.find({ theaterId: req.params.id }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    }).sort({ movieDate: 1, roomName: 1 });
  }

  //[POST] /admin/deleteShowTimeById/:id
  deleteShowTimeById(req, res, next) {
    ShowTimeModel.updateOne(
      { _id: req.params.id },
      { $pull: { movieTime: { time: req.body.time } } }
    )
      .then((result) => res.json(result))
      .catch(next);
  }

  //[PUT] /admin/updateStateShowTimeById/:id
  updateStateShowTimeById(req, res, next) {
    ShowTimeModel.updateOne(
      { _id: req.params.id, "movieTime.time": req.body.time },
      { $set: { "movieTime.$.state": 1 } }
    )
      .then((result) => res.json(result))
      .catch(next);
  }

  getAllShowtimeByIdFilmAndTheater(req, res, next) {
    ShowTimeModel.find({
      $and: [{ theaterId: req.body.idTheater }, { filmId: req.body.idfilm }],
    })
      .then((result) => res.json(result))
      .catch(next);
  }

  // [POST] /admin/getAllYear
  getAllYear(req, res, next) {
    BillModel.find({})
      .then((result) => {
        const arr = result.map((item) => {
          return item.createdAt.toString().slice(11, 15);
        });
        return res.json(arr.filter((v, i, a) => a.indexOf(v) === i));
      })
      .catch(next);
  }

  //[POST] /admin/getAllBillByYearAndTheaterId/:id
  getAllBillByYearAndTheaterId(req, res, next) {
    BillModel.find({
      $and: [
        { theaterId: req.params.id },
        { showtime: new RegExp(req.body.year) },
      ],
    })
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  }
}

module.exports = new Admin();
