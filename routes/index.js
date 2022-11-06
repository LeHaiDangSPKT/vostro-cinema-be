const user = require("./user");
const admin = require("./admin");

function route(app) {
  app.use("/user", user);
  app.use("/admin", admin);
}
module.exports = route;
