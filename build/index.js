"use strict";

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _morgan = _interopRequireDefault(require("morgan"));

var _compression = _interopRequireDefault(require("compression"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _connection = _interopRequireDefault(require("./config/connection"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import cookieParser from 'cookie-parser';
// import session from 'cookie-session';
// import csurf from 'csurf';
// import * as Sentry from "@sentry/node";
// import { catchFirst, catchAll } from "./middlewares";
_dotenv["default"].config(); // Sentry initialize
// Sentry.init({
//   dsn: "https://af875853bbe6492196a59bfc877ee125@o114383.ingest.sentry.io/5276151"
// });


var app = (0, _express["default"])(); // sentry setup
// app.use(Sentry.Handlers.requestHandler());

var whiteList = []; //

if (process.env.NODE_ENV === "development") {
  whiteList = ["http://localhost:".concat(process.env.PORT), "http://localhost:3000", "http://localhost:3001"];
  app.use((0, _morgan["default"])("dev"));
  (0, _connection["default"])(process.env.MONGODB_DEV);
} else {
  whiteList = ["http://www.designweekpuebla.com", "https://www.designweekpuebla.com"];
  (0, _connection["default"])(process.env.MONGODB_URI);
}

var corsOptions = {
  origin: function origin(_origin, callback) {
    if (whiteList.indexOf(_origin) !== -1 || !_origin) {
      callback(null, true);
    } else {
      console.log({
        origin: _origin
      });
      callback(new Error("Not allowed by CORS"));
    }
  } // credentials: true

};
app.use((0, _compression["default"])());
app.use((0, _helmet["default"])());
app.options("*", (0, _cors["default"])());
app.use((0, _cors["default"])(corsOptions));
app.use(_bodyParser["default"].json());
app.set("trust proxy", 1); // app.use(cors());
// app.use(session({
//   secret: '4lw4y5 Be773r',
// }))
// app.use(cookieParser('secret'));
// app.use(csurf({cookie:true}));

app.disable("x-powered-by");
app.use(_express["default"].urlencoded({
  extended: false
})); // app.use((req, res, next) => {
//   if (req.originalUrl.includes("stripe-webhook")) {
//     next();
//   } else {
//     bodyParser.json()(req, res, next);
//   }
// });

app.use("/api", _routes["default"]); // The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

if (process.env.NODE_ENV === "production") {
  // app.get("/", catchFirst);
  // Serve any static files
  app.use(_express["default"]["static"](_path["default"].join(__dirname, "../app/build"))); // force https

  app.use(function (req, res, next) {
    if (req.get("X-Forwarded-Proto") !== "https") {
      res.redirect("https://".concat(req.get("Host")).concat(req.url));
    } else next();
  });
  var sixtyDaysInSeconds = 5184000;
  app.use(_helmet["default"].hsts({
    maxAge: sixtyDaysInSeconds
  })); // Handle React routing, return all requests to React app

  app.get("*", function (req, res) {
    res.sendFile(_path["default"].join(__dirname, "../app/build", "index.html"));
  }); // app.get("*", catchAll);
  // app.use(Sentry.Handlers.errorHandler());
} // catch 404 and forward to error handler


app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // error handler

app.use(function (error, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = error.message; // res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.locals.error = error; // render the error page

  console.warn({
    appLevelError: error
  });
  res.status(error.status || 500).json({
    error: error.es || error.en ? error : error.toString()
  });
  next(error); // res.render('error');
});
module.exports = app;