// @ts-nocheck
import Fixtures from "../models/fixtures";
import * as redis from "redis";

// Redis client
let redisConfig = {
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
};

const client = redis.createClient(redisConfig);
client.on("connect", () => console.log("::> Redis Client Connected"));
client.on("error", (err: Error) => console.log("<:: Redis Client Error", err));

export const viewAllFixtures = (req, res, next) => {
  Fixtures.find(req.query)
    .then(
      (fixture) => {
        res.statusCode = 200;
        res.json(fixture);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const viewPendingFixtures = (req, res, next) => {
  Fixtures.find({ status: 'pending' })
    .then(
      (fixture) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fixture);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const viewCompletedFixtures = (req, res, next) => {
  Fixtures.find({ status: "completed" })
    .then(
      (fixture) => {
        res.statusCode = 200;
        res.json(fixture);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const addFixtures = (req, res, next) => {
  Fixtures.create(req.body)
    .then(
      (resp) => {
        // Set data to Redis
        Fixtures.find(req.query)
          .then(
            (fixture) => {
              res.statusCode = 201;
              client.setex("fixtures", 3600, JSON.stringify(fixture));
              res.json(resp);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const deleteFixtures = (req, res, next) => {
  Fixtures.deleteMany({})
    .then(
      (resp) => {
        // Set data to Redis
        Fixtures.find(req.query)
          .then(
            (fixture) => {
              res.statusCode = 200;
              client.setex("fixtures", 3600, JSON.stringify(fixture));
              res.json(resp);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const viewUniquefixture = (req, res, next) => {
  Fixtures.find({slug: `${req.params.slug}`})
    .then(
      (fixture) => {
        res.statusCode = 200;
        res.json(fixture);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const updatefixture = (req, res, next) => {
  Fixtures.findByIdAndUpdate(
    req.params.fixturesId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (resp) => {
        // Set data to Redis
        Fixtures.find(req.query)
          .then(
            (fixture) => {
              res.statusCode = 200;
              client.setex("fixtures", 3600, JSON.stringify(fixture));
              res.json(resp);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const deleteOnefixture = (req, res, next) => {
  Fixtures.findByIdAndRemove(req.params.fixturesId)
    .then(
      (resp) => {
        // Set data to Redis
        Fixtures.find(req.query)
          .then(
            (fixture) => {
              res.statusCode = 200;
              client.setex("fixtures", 3600, JSON.stringify(fixture));
              res.json(resp);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

// Fixture Cache middleware
export const cache = async (req, res, next) => {
  client.get("fixtures", (error, fixture) => {
    if (error) console.error(error);
    if (fixture !== null) {
      return res.json(JSON.parse(fixture));
    } else {
      next();
    }
  });
};
