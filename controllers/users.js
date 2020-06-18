const express = require("express");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const router = express.Router();
const user = mongoose.model("users");
const Joi = require("@hapi/joi");
const { JWT_SECRET } = require("../configuration/index");
const passport = require("passport");
const passportConfig = require("../passport");

signToken = (user) => {
  return (token = JWT.sign(
    {
      iss: "RT",
      sub: user._id,
      iat: new Date().getTime(), //current time
      exp: new Date().setDate(new Date().getDate() + 1), //expiration date
    },
    JWT_SECRET
  ));
};

const userSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).required(),
});

//---------------------------------------
//sign up
router.post("/signup", async (req, res) => {
  console.log("usersController.signup() called ");

  const { error } = userSchema.validate(req.body);
  if (error) {
    //400 bad request
    res.status(400).send(error.details[0].message);
    return;
  }
  const { username, password } = req.body;
  //check if there is a user with the same email
  const founduser = await user.findOne({ username });
  if (founduser) {
    return res.status(403).json({ error: "username is already in use" });
  }
  //create a new user
  const newUser = new user({
    username,
    password,
  });
  await newUser.save();

  //respond with token

  const token = signToken(newUser);
  res.status(200).json({ token });
});

//-------------------------------------------
//sign in
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
    console.log("I am in sign in");
  }
);

//-------------------------------------------
//secret
router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("I am in secret");
    res.json({ secret: "resource" });
  }
);

module.exports = router;
