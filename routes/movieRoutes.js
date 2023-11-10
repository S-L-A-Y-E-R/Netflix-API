const express = require("express");
const {
  getAllMovies,
  getRandomMovie,
  getOneMovie,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/", getAllMovies);
router.get("/random", getRandomMovie);
router.get("/:id", getOneMovie);

module.exports = router;
