const connection = require("./model");
const express = require("express");
const application = express();

const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const systemInfoController = require("./controllers/systemInfo");
const userController = require("./controllers/users");

application.use(bodyparser.json());

application.get("/", (req, res) => {
  res.send("hello");
  res.render("index", {});
});

application.use("/temp", systemInfoController);
application.use("/user", userController);

application.listen("1205", () => {
  console.log("server started");
});
