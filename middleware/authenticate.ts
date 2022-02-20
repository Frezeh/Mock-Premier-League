// @ts-nocheck
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/users";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken"; // used to create, sign, and verify tokens
import dotenv from "dotenv";
import { NextFunction } from "express";

dotenv.config();

export const local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this will create the token and give it to us
export const getToken = function (user: string) {
  return jwt.sign(user, process.env.SECRETKEY as string, { expiresIn: 3600 });
};

//opt specifies how the jsonwebtoken should be extracted from the incoming request message
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

export const jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err: string, user: string) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

export const verifyUser = passport.authenticate("jwt", { session: false });

export const verifyAdmin = (req, res, next) => {
  if (req.user.admin == true) {
    next();
  } else {
    let err = new Error("You are not an Admin");
    err.status = 403;
    next(err);
  }
};
