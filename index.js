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
