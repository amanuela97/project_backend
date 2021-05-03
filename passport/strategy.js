"use strict";
import passport from 'passport';
import pkk from 'passport-local';
const { Strategy } = pkk;
import bcrypt from 'bcrypt';
import userModel from '../models/user.js';
import passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import dotenv from 'dotenv';
dotenv.config();

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    console.log("13", username, password);
    try {
      const user = await userModel.findOne({ username });
      console.log("Local strategy", user);
      if (user === null) {
        return done(null, false, { message: "Incorrect credentials." });
      }
      const validate = await bcrypt.compare(password, user.password);
      if (!validate) {
        return done(null, false, { message: "Incorrect credentials." });
      }

      const strippedUser = user.toObject();
      delete strippedUser.password; // make sure that the password does not travel around...
      console.log("deleted pwd", strippedUser);

      return done(null, strippedUser, { message: "Logged In Successfully" });
    } catch (err) {
      return done(err);
    }
  })
);

// TODO: JWT strategy for handling bearer token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userModel.findById(jwtPayload.id);
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(null, false);
      }
    }
  )
);

export default passport;
