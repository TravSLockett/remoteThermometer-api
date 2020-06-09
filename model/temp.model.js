const mongoose = require("mongoose");

var temp = mongoose.model(
  "temp",
  new mongoose.Schema({
    cpu: Number,
    gpu: Number,
  })
);
