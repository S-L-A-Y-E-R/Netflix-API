const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRoutes = require("./routes/usersRoutes");
const path = require("path");
const movieRouter = require("./routes/movieRoutes");

const app = express();

//Limit data incoming from the request body
app.use(express.json());

//serving static files
app.use(express.static(path.join(__dirname, "public")));

//Enable outsource proxies
app.set("trust proxy", true);

//Allow cors for all domains
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

//Set security http headers
app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Use morgan logger in the develpment
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//We used the webhook checkout here, because it needs a body of type raw not JSON
// app.post('/webhook-checkout',
//   bodyParser.raw({ type: 'application/json' }),
//   webhookCheckout
// );

//Data sanitization agains noSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss attacks
app.use(xssClean());

//Prevent parameter pollution
app.use(hpp());

//Parse and manipulate cookies
app.use(cookieParser());

//Compress all text sent in the response to the client
if (process.env.NODE_ENV === "production") {
  app.use(compression());
}

//Global resources
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRouter);

// Handle requests from wrong urls
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Using global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
