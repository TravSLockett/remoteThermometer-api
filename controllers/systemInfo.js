const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const sysIModel = mongoose.model("sysI");
const Joi = require("@hapi/joi");
const passport = require("passport");
const tokenID = mongoose.model("tokenID");

//data validation
/*
const schema = Joi.object({
  //cpu: Joi.number().min(0).required(),
  //gpu: Joi.number().min(0).required(),
  manufacturer: Joi.string().min(0).required(),
});

*/

//posting the data
router.post(
  "/push",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //validate the data and return any error
    /*
    const { error } = schema.validate(req.body); //result.error from property destructuring
    if (error) {
      //400 bad request
      res.status(400).send(error.details[0].message);
      return;
    }
    */
    //handle cpu and gpu and message
    //got rid of cpu and gpu message check
    /*
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
*/
    //get the user belong id from the token provided
    var query = { curToken: req.headers.authorization };
    const signedInUser = tokenID.findOne(query);
    if (!signedInUser) {
      return done(null, false);
    }
    const belong = (await signedInUser).userID;
    //create a new record with cpu, gpu and belong tag
    const time = Math.round(Date.now() / 1000);
    const newRecord = new sysIModel({
      belong: belong,
      time: time,
      Battery: req.body.Battery,
      CPUSpec: req.body.CPUSpec,
      CPUTemp: req.body.CPUTemp,
      Processes: req.body.Processes,
      Disk: req.body.Disk,
    });

    await newRecord.save((err, docs) => {
      if (!err) {
        console.log("saved the system info object successfully");
        const response = { docs };
        res.send(response);
      } else {
        console.log(err);
        console.log("cannot save system info object");
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
    sysIModel.find(query2, (err, docs) => {
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
