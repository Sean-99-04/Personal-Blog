const mongoose = require("mongoose");

const Subscriber = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  subDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Subscriber", Subscriber, "subscribers");
