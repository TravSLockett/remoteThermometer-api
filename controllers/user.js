const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const tempModel = mongoose.model("temp");

//posting the data
router.post("/push", (req, res) => {
  var newRecord = new tempModel();
  newRecord.cpu = req.body.cpu;
  newRecord.gpu = req.body.gpu;

  newRecord.save((err, docs) => {
    if (!err) {
      console.log("saved!");
      res.send(docs);
    } else {
      console.log(err);
      console.log("cannot save!");
    }
  });
});

router.get("/list", (req, res) => {
  //getting the data
  tempModel.find((err, docs) => {
    if (!err) {
      console.log(docs);
      res.send(docs);
    } else {
      res.send("user controller YES error");
    }
  });
  //res.send("userInfo Controller");
});

module.exports = router;
