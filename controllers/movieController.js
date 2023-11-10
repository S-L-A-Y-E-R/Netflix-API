const Movie = require("../models/movieModel");
const catchAsync = require("../utils/catchAsync");
const { getOne } = require("./factoryHandler");

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    status: "success",
    length: movies.length,
    data: movies,
  });
});

exports.getRandomMovie = catchAsync(async (req, res, next) => {
  const randomMovie = await Movie.aggregate([
    {
      $sample: { size: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: randomMovie,
  });
});

exports.getOneMovie = getOne(Movie);
