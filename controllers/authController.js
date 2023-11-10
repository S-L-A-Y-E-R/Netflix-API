const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/usermodel");
const AppError = require("../utils/appError");

const generateAccessToken = (newUser) => {
  const accessToken = jwt.sign(
    { id: newUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );

  return accessToken;
};

const generateRefreshToken = (newUser) => {
  const refreshToken = jwt.sign(
    { id: newUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  return refreshToken;
};

const createAndSendTokens = (user, res, statusCode) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const cookieOptions = (tokenType) => {
    return {
      expires: new Date(
        Date.now() +
          `${
            tokenType === "accessToken"
              ? process.env.ACCESS_TOKEN_COOKIE_EXPIRES_IN
              : process.env.REFRESHH_TOKEN_COOKIE_EXPIRES_IN
          }` *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: `${process.env.NODE_ENV === "production" ? true : false}`,
    };
  };

  res.cookie("accessToken", accessToken, cookieOptions("accessToken"));
  res.cookie("refreshToken", refreshToken, cookieOptions("refreshToken"));

  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    message: "success",
    refreshToken,
    accessToken,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendTokens(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createAndSendTokens(user, res, 200);
});

exports.googleLogin = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    createAndSendTokens(user, res, 200);
  } else {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      photo: req.body.photo,
      password: Math.random().toString(36).slice(-8),
    });

    await newUser.save({ validateBeforeSave: false });

    createAndSendTokens(newUser, res, 201);
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return next(
      new AppError("You are not loggedIn. Please logIn to get access!", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this access token deos not exist",
        401
      )
    );
  }

  if (user.passwordChanged(decoded.iat)) {
    return new AppError(
      "User recently changed his password. Please logIn again!",
      401
    );
  }

  req.user = user;

  next();
});

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    status: "success",
  });
};

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Please provide the refresh token", 400));
  }

  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("Refresh token is invalid or has expired", 401));
  }

  createAndSendTokens(user, res, 200);
});
