const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT;

var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const URL = process.env.DATABASE_URL;
const REACT_URL = process.env.REACT_URL;
//Fix CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", REACT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors());
mongoose
  .connect(URL, { dbName: "vostroCinema" })
  .then(() => console.log("Connect successfully!"))
  .then(() =>
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    })
  )
  .catch((err) => console.log(err));
route(app);
