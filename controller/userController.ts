// @ts-nocheck
import { Router, logIn } from "express";
import User from "../models/users";
import passport from "passport";
import * as authenticate from "../middleware/authenticate";

const router = Router();

export const signUp = (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      }

      //if body of the incoming message, contains the first name, user.firstname is equal to req.body.firstname
      else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user.save().then((user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: true,
            status: "Registration Successful!",
          });
        });
      }
    }
  );
};

export const login = async (req, res, next) => {
  //err will be returned when there is a error that occurs during the authentication, but the info will contain information if the user doesn't exist
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }

    //user object is not null, no error occurred, which means the user can be logged in.
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }

      const token = authenticate.getToken({ _id: req.user._id });
      let userId = req.user._id;
      req.session.message = "session stored";
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "Login Successful!",
        token: token,
        id: userId,
      });
    });
  })(req, res, next);
};

export const logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
};

export const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

export const deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};
