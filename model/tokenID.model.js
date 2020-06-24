const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tokenIDSchema = new mongoose.Schema({
  userID: String,
  curToken: String,
});

var tokenID = mongoose.model("tokenID", tokenIDSchema, "tokenID");
