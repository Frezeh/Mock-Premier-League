// @ts-nocheck
import Teams from "../models/teams";
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

export const viewTeams = (req, res, next) => {
  Teams.find(req.query)
    .then(
      (team) => {
        res.statusCode = 200;
        res.json(team);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const addTeams = (req, res, next) => {
  Teams.create(req.body)
    .then(
      (resp) => {
        Teams.find(req.query)
          .then(
            (team) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              // Set data to Redis
              client.setex("teams", 3600, JSON.stringify(team));
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

export const deleteTeams = (req, res, next) => {
  Teams.deleteMany({})
    .then(
      (resp) => {
        Teams.find(req.query)
          .then(
            (team) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              // Set data to Redis
              client.setex("teams", 3600, JSON.stringify(team));
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

export const viewOneTeam = (req, res, next) => {
  Teams.findById(req.params.teamsId)
    .then(
      (team) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(team);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const updateTeam = (req, res, next) => {
  Teams.findByIdAndUpdate(
    req.params.teamsId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (resp) => {
        Teams.find(req.query)
          .then(
            (team) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              // Set data to Redis
              client.setex("teams", 3600, JSON.stringify(team));
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

export const deleteOneTeam = (req, res, next) => {
  Teams.findByIdAndRemove(req.params.teamsId)
    .then(
      (resp) => {
        Teams.find(req.query)
          .then(
            (team) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              // Set data to Redis
              client.setex("teams", 3600, JSON.stringify(team));
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

// Cache middleware
export const cache = async (req, res, next) => {
  client.get("teams", (error, team) => {
    if (error) console.error(error);
    if (team !== null) {
      return res.json(JSON.parse(team));
    } else {
      next();
    }
  });
};
