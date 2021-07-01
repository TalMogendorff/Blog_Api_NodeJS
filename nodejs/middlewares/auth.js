const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("../models/Users");
const bcrypt = require("bcrypt");

const localStrategy = new LocalStrategy(async (username, password, done) => {
  let user = await User.findOne({ email: username });
  if (!user) return done(null, false, { message: "Incorrect username" });

  try {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  } catch (error) {
    if (error) return done(null, false, { message: "Unknown error" });
  }
});

const authorize = (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(401).send("unauthorized");
  next();
};

module.exports = { localStrategy, authorize };
