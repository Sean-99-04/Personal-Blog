const mongoose = require("mongoose");

const Article = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: new Date(),
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Article", Article, "articles");
