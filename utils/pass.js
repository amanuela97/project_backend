import passport from 'passport';
import { Strategy } from 'passport-local';
import { Strategy as _Strategy, ExtractJwt } from 'passport-jwt';
const JWTStrategy = _Strategy;
const ExtractJWT = ExtractJwt;
import { getUserLogin } from '../models/userModels.js';
import { compare } from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new Strategy( async (username, password, done) => {
    // get user by username but in our case username = email from getUserLogin
    const user = getUserLogin(username);
    console.log(user);
    // if user is undefined
    if (user === undefined) {
      return done(null, false,{message: 'Incorrect email.'});
    }
    try{
      if( await compare(password, user.password) || password == user.password) {
         // if all is ok
        delete user.password;
        return done(null, user,{message: 'Logged In Successfully'});
      }else{
        // if passwords dont match
        return done(null, false, {message: 'Incorrect password.'});
      }
    }catch(e){
      return done(e);
    }

  })
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    (jwtPayload, done) => {
      console.log('payload: ', jwtPayload);
      const user = getUserLogin(jwtPayload.email);
      if (user === undefined) {
        return done(null, false);
      }
      return done(null, jwtPayload);
    }
  )
);

export default passport;
