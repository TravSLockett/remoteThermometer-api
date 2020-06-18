const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userScheme = new mongoose.Schema({
  username: String,
  password: String,
});

userScheme.pre("save", async function (next) {
  try {
    //generate a salt
    const salt = await bcrypt.genSalt(10);
    //generate hashed password
    const passwordHash = await bcrypt.hash(this.password, salt);
    //assign hashed version of password
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

userScheme.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

var user = mongoose.model("users", userScheme);
