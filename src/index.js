import createError from "http-errors";
import express from "express";
import path from "path";
// import cookieParser from 'cookie-parser';
// import session from 'cookie-session';
import logger from "morgan";
// import csurf from 'csurf';
import compression from "compression";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
// import * as Sentry from "@sentry/node";
import mongooseConnection from "./config/connection";
import routes from "./routes";
// import { catchFirst, catchAll } from "./middlewares";

dotenv.config();

// Sentry initialize
// Sentry.init({
//   dsn: "https://af875853bbe6492196a59bfc877ee125@o114383.ingest.sentry.io/5276151"
// });

const app = express();

// sentry setup
// app.use(Sentry.Handlers.requestHandler());

let whiteList = [];
//
if (process.env.NODE_ENV === "development") {
  whiteList = [
    `http://localhost:${process.env.PORT}`,
    "http://localhost:3000",
    "http://localhost:3001"
  ];
  app.use(logger("dev"));
  mongooseConnection(process.env.MONGODB_DEV);
} else {
  whiteList = [
    "http://www.designweekpuebla.com",
    "https://www.designweekpuebla.com"
  ];
  mongooseConnection(process.env.MONGODB_URI);
}

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log({ origin });
      callback(new Error("Not allowed by CORS"));
    }
  }
  // credentials: true
};

app.use(compression());
app.use(helmet());
app.options("*", cors());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.set("trust proxy", 1);
// app.use(cors());
// app.use(session({
//   secret: '4lw4y5 Be773r',
// }))
// app.use(cookieParser('secret'));
// app.use(csurf({cookie:true}));
app.disable("x-powered-by");

app.use(
  express.urlencoded({
    extended: false
  })
);
// app.use((req, res, next) => {
//   if (req.originalUrl.includes("stripe-webhook")) {
//     next();
//   } else {
//     bodyParser.json()(req, res, next);
//   }
// });

app.use("/api", routes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === "production") {
  // app.get("/", catchFirst);

  // Serve any static files
  app.use(express.static(path.join(__dirname, "../app/build")));

  // force https
  app.use((req, res, next) => {
    if (req.get("X-Forwarded-Proto") !== "https") {
      res.redirect(`https://${req.get("Host")}${req.url}`);
    } else next();
  });
  const sixtyDaysInSeconds = 5184000;
  app.use(
    helmet.hsts({
      maxAge: sixtyDaysInSeconds
    })
  );

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../app/build", "index.html"));
  });
  // app.get("*", catchAll);

  // app.use(Sentry.Handlers.errorHandler());
}
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((error, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = error.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = error;

  // render the error page
  console.warn({ appLevelError: error });
  res.status(error.status || 500).json({
    error: error.es || error.en ? error : error.toString()
  });
  next(error);

  // res.render('error');
});

module.exports = app;
