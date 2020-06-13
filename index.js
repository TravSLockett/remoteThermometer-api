const connection = require("./model");
const express = require("express");
const application = express();
const path = require("path");
const expressHandlerbars = require("express-handlebars");
const bodyparser = require("body-parser");
const userController = require("./controllers/user");

application.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

application.set("views", path.join(__dirname, "/views/"));

application.engine(
  "hbs",
  expressHandlerbars({
    extname: "hbs",
    defaultLayout: "mainlayout",
    layoutsDir: __dirname + "/views/layouts",
  })
);

application.set("view engine", "hbs");

application.get("/", (req, res) => {
  //res.send("hello");
  res.render("index", {});
});

application.use("/user", userController);

application.listen("1205", () => {
  console.log("server started");
});
