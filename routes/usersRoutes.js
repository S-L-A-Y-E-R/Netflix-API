const express = require("express");

const {
  signUp,
  login,
  protect,
  logout,
  refreshAccessToken,
  googleLogin,
} = require("../controllers/authController");
const {
  getAllUsers,
  getOneUser,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getMe,
  getUserPhoto,
  uploadUserPhoto,
  resizeUserPhoto,
  addToFavorites,
  getUserFavorites,
  deleteUserFavorites,
} = require("../controllers/usersController");

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.post("/google-login", googleLogin);

router.post("/refresh-token", refreshAccessToken);

router.get("/get-photo/:id", getUserPhoto);

router.patch("/:id/favorite", addToFavorites);

router.get("/:id/favorite", getUserFavorites);

router.delete("/:id/favorite", deleteUserFavorites);

//This middleware will protect all the incoming routes
router.use(protect);

router.post("/logout", logout);

router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);

router.delete("/deleteMe", deleteMe);

router.get("/me", getMe, getOneUser);

router.get("/", getAllUsers);

router.route("/:id").get(getOneUser).delete(deleteUser).patch(updateUser);

module.exports = router;
