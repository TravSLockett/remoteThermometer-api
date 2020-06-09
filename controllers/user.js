const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const tempModel = mongoose.model("temp");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  cpu: Joi.number().min(0).required(),
  gpu: Joi.number().min(0).required(),
});

//posting the data
router.post("/push", (req, res) => {
  const { error } = schema.validate(req.body); //result.error from property destructuring
  if (error) {
    //400 bad request
    res.status(400).send(error.details[0].message);
    return;
  }
  var message = "";
  var newRecord = new tempModel();
  if (req.body.cpu > 0) {
    message = "C";
    newRecord.cpu = req.body.cpu;
  }

  if (req.body.gpu > 0) {
    message = message + "G";
    newRecord.gpu = req.body.gpu;
  }

  if (message.length == 0) {
    message = "Error";
    res.send("Error");
    return;
  }

  newRecord.save((err, docs) => {
    if (!err) {
      console.log("saved!");
      const response = { docs, message };
      res.send(response);
    } else {
      console.log(err);
      console.log("cannot save!");
    }
  });
});

//getting the data
router.get("/list", (req, res) => {
  tempModel.find((err, docs) => {
    if (!err) {
      console.log(docs);
      res.send(docs);
    } else {
      res.send("There was an error requesting the data");
    }
  });
  //res.send("userInfo Controller");
});

module.exports = router;
