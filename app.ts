// @ts-nocheck
// Dependencies
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import createError from "http-errors";
import helmet from "helmet";
import path from "path";
import logger from "morgan";
import passport from "passport";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectRedis from "connect-redis";
import session from "express-session";
import * as redis from "redis";

// Routes Modules
import indexRouter from "./routes/index";
import teamsRouter from "./routes/manageTeams";
import fixturesRouter from "./routes/createFixtures";
import fixturesStatusRouter from "./routes/fixtureStatusRouter";
import userRouter from "./routes/users";
import searchRouter from "./routes/search";

// Middleware
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
const RedisStore = connectRedis(session);
const RedisSecret = process.env.REDIS_SECRET;

let redisConfig = {
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
};

// Connect MongoDB to app
  mongoose
    .connect(URI)
    .then(() =>
      app.listen(PORT, () => {
        console.log(`Server Running on Port: http://localhost:${PORT}`);
      })
    )
    .catch((error) => console.log(`${error} did not connect`));

// Cors whitelist
const whitelist = [
  "http://localhost:3000",
  "https://mockpremierleague.herokuapp.com/",
];

// Cors options
const options: cors.CorsOptions = {
  origin: whitelist,
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 100,
});

// Redis client
const client = redis.createClient(redisConfig);
client.on("connect", () => console.log("::> Redis Client Connected"));
client.on("error", (err: Error) => console.log("<:: Redis Client Error", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Redis session storage
app.use(
  session({
    name: "redis-session",
    store: new RedisStore({
      client: client,
      disableTouch: true,
    }),
    secret: RedisSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(limiter);
app.set("trust proxy", 1);
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/", indexRouter);
app.use(cors(options));
app.use("/api/v1/teams", teamsRouter);
app.use("/api/v1/fixtures", fixturesRouter);
app.use("/api/v1/status", fixturesStatusRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/search", searchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

export default app;
