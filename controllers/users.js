const express = require("express");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const router = express.Router();
const user = mongoose.model("users");
const tokenID = mongoose.model("tokenID");
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

  async (req, res, done) => {
    //create the token based on the user signing in
    const token = signToken(req.user);

    //find the userID
    const signedInUser = user.findOne(req.user);
    if (!signedInUser) {
      return done(null, false);
    }
    const userID = (await signedInUser)._id;

    //create a new tokenID record
    const newTokenID = new tokenID({
      userID: userID,
      curToken: token,
    });

    await newTokenID.save((err, docs) => {
      if (!err) {
        console.log("newTokenID is saved!");
      } else {
        console.log("cannot save newTokenID!");
        console.log(err);
      }
    });
    //return the token to the client
    res.status(200).json({ token });
    console.log("sign in process is finished");
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
