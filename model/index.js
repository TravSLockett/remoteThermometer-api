const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/user",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (!error) {
      console.log("success!");
    } else {
      console.log("cannot connect to database");
    }
  }
);

const temp = require("./temp.model");
const user = require("./user.model");
