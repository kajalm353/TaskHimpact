const express = require("express");
// const app = express();
const bodyParser = require("body-parser");

const users = require("../routes/Users");

module.exports = function (app) {
  app.use(
    bodyParser({
      limit: "50mb",
    })
  );

  app.use(express.json());
  app.use("/api/users", users);
};
