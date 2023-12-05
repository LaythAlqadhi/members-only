const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const flash = require('express-flash');

exports.login_get = (req, res) => {
  const messages = req.flash('error');
  const user = req.user;

  res.render('login', {
    user: user,
    messages: messages
  });
};

exports.login_post = [
  body('username').notEmpty().trim().escape(),
  body('password').notEmpty().trim().escape(),

  asyncHandler(async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    next();
  }),

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
];

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};