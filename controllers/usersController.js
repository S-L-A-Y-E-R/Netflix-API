const catchAsync = require("../utils/catchAsync");
const User = require("../models/usermodel");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { deleteOne, updateOne, getOne, getAll } = require("./factoryHandler");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/${req.file.filename}`);

  next();
});

exports.getAllUsers = getAll(User);

exports.getOneUser = getOne(User);

exports.deleteUser = deleteOne(User);

exports.updateUser = updateOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const { username, email, password } = req.body;

  const filteredBody = { username, email, password };
  if (req.file) filteredBody.photo = req.file.filename;

  if (filteredBody.username) user.username = filteredBody.username;
  if (filteredBody.email) user.email = filteredBody.email;
  if (filteredBody.photo) user.photo = filteredBody.photo;
  if (filteredBody.password) user.password = filteredBody.password;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUserPhoto = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No document found with that id", 404));
  }
  res.download(path.resolve(`${__dirname}/../public/images/${user.photo}`));
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.addToFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: {
        favoriteIds: req.body.movieId,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getUserFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: user.favoriteIds,
  });
});

exports.deleteUserFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $pull: { favoriteIds: req.body.movieId } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user,
  });
});
