const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "The movie must have a title"],
  },
  desciption: {
    type: String,
    required: [true, "The movie must have a title"],
  },
  videoUrl: String,
  thumbnailUrl: String,
  genre: String,
  duration: String,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
