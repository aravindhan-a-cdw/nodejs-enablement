const { Strategy, ExtractJwt } = require('passport-jwt');
const {Strategy: LocalStrategy} = require('passport-local');
const UserSchema = require('../models/user');
const { USER } = require('../constants/schema');


const jwtOptions = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        const user = await UserSchema.findOne({ employeeId: payload.id, status: USER.STATUS[1] }, "-password -__v -createdAt -updatedAt");
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
};

// Local strategy for username and password login

const localStrategy =  new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UserSchema.findOne({ email: username });
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    );

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
module.exports = {
    jwtStrategy,
    localStrategy
}