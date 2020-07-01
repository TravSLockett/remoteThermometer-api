const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const systemInfoSchema = new mongoose.Schema({
  belong: String,
  time: Number,
  Battery: {
    percent: Number,
    isCharging: Boolean,
  },
  CPUSpec: {
    manufacturer: String,
    brand: String,
    speed: String,
    speedmax: String,
    speedmin: String,
  },
  CPUTemp: {
    main: Number,
    cores: [Number],
    max: Number,
  },
  Processes: [{ pid: String, name: String }],
  Disk: [{ use: String, mount: String }],
});

var temp = mongoose.model("sysI", systemInfoSchema);
