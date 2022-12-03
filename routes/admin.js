const express = require("express");
const router = express.Router();

const AdminController = require("../controller/Admin");

router.put("/deleteTheaterById/:id", AdminController.deleteTheaterById); //update state
router.put("/deleteFilmById/:id", AdminController.deleteFilmById); //update state
router.put("/deleteAccountById/:id", AdminController.deleteAccountById); //update state
router.put("/updateTheaterById/:id", AdminController.updateTheaterById);
router.put("/updateFilmById/:id", AdminController.updateFilmById);
router.put(
  "/updateChairServiceByName/:name",
  AdminController.updateChairServiceByName
);
router.put("/updateMenuService", AdminController.updateMenuService);
router.put("/updateShowTime/:id", AdminController.updateShowTime);
router.put(
  "/updateStateShowTimeById/:id",
  AdminController.updateStateShowTimeById
);

router.post("/addTheaterAndRoom", AdminController.addTheaterAndRoom);
router.post("/addFilm", AdminController.addFilm);
router.post("/addShowTime", AdminController.addShowTime);
router.post("/getOneShowTime", AdminController.getOneShowTime);
router.post("/deleteShowTimeById/:id", AdminController.deleteShowTimeById);
router.post(
  "/getAllShowtimeByIdFilmAndTheater",
  AdminController.getAllShowtimeByIdFilmAndTheater
);
router.post("/getAllYear", AdminController.getAllYear);
router.post(
  "/getAllBillByYearAndTheaterId/:id",
  AdminController.getAllBillByYearAndTheaterId
);

router.get("/getAllTheater", AdminController.getAllTheater);
router.get("/getOneTheaterById/:id", AdminController.getOneTheaterById);
router.get("/getNameAndIdAllTheater", AdminController.getNameAndIdAllTheater);
router.get("/getAllFilms", AdminController.getAllFilms);
router.get("/getAllFilmsById/:id", AdminController.getAllFilmsById);
router.get("/getAllUsers", AdminController.getAllUsers);
router.get("/getChairService", AdminController.getChairService);
router.get("/getMenuService", AdminController.getMenuService);
router.get("/getAllShowTimesById/:id", AdminController.getAllShowTimesById);

module.exports = router;
