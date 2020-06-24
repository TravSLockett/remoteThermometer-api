const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const tempModel = mongoose.model("temp");
const Joi = require("@hapi/joi");
const passport = require("passport");
const tokenID = mongoose.model("tokenID");

const schema = Joi.object({
  cpu: Joi.number().min(0).required(),
  gpu: Joi.number().min(0).required(),
});

//posting the data
router.post(
  "/push",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { error } = schema.validate(req.body); //result.error from property destructuring
    if (error) {
      //400 bad request
      res.status(400).send(error.details[0].message);
      return;
    }
    //handle cpu and gpu and message
    const { cpu, gpu } = req.body;
    var message = "";
    if (cpu > 0) {
      message = "C";
    }
    if (gpu > 0) {
      message = message + "G";
    }
    if (message.length == 0) {
      message = "Error";
      res.send("Error");
      return;
    }

    //get the user belong id from the token provided
    var query = { curToken: req.headers.authorization };
    const signedInUser = tokenID.findOne(query);
    if (!signedInUser) {
      return done(null, false);
    }
    const belong = (await signedInUser).userID;
    //create a new record with cpu, gpu and belong tag
    //var d = new Date();
    const time = Math.round(Date.now() / 1000);
    const newRecord = new tempModel({
      cpu,
      gpu,
      belong,
      time,
    });

    await newRecord.save((err, docs) => {
      if (!err) {
        console.log("saved this new cpu gpu temps successfully!");
        const response = { docs, message };
        res.send(response);
      } else {
        console.log(err);
        console.log("cannot save the new cpu gpu temps!");
      }
    });
  }
);

//---------------------------------------------
//getting the data
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var query = { curToken: req.headers.authorization };

    const signedInUser = tokenID.findOne(query);
    if (!signedInUser) {
      return done(null, false);
    }
    const userID = (await signedInUser).userID;

    var query2 = { belong: userID };
    tempModel.find(query2, (err, docs) => {
      if (!err) {
        console.log("got your data for ya!");
        res.send(docs);
      } else {
        console.log(err);
        res.send(err);
      }
    });
  }
);

module.exports = router;
