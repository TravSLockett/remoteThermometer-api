const passport = require("passport");
const JWTstrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("./configuration/index");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const LocalStrategy = require("passport-local").Strategy;

//json web token strategy
passport.use(
  new JWTstrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        //find user specified in a token
        const user = await User.findById(payload.sub);
        //if user does not exist, handle it
        if (!user) {
          return done(null, false);
        }

        //otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        //find the user given the username
        const user = await User.findOne({ username });
        //if not handle it
        if (!user) {
          return done(null, false);
        }
        //check if the password is correct
        const isMatch = await user.isValidPassword(password);
        // if not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        //return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
