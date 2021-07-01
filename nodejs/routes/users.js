const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/Users");
const _ = require("lodash");
const { authorize } = require("../middlewares/auth");

router.post(
  "/login",
  (req, res, next) => {
    if (req.isAuthenticated()) return res.send("Already logged in");
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User already registered, please try again");

  try {
    user = new User(req.body);
    const salty = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salty);
    await user.save();
    console.log(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
