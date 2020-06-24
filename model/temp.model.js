const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tempSchema = new mongoose.Schema({
  cpu: Number,
  gpu: Number,
  belong: String,
  time: Number,
});

var temp = mongoose.model("temp", tempSchema);
