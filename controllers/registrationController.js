const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render('signup', {
    title: 'Sign Up',
  });
});

exports.signup_post = [
  body('first_name', 'First Name must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First Name must not be less than 2 characters.')
    .isLength({ max: 25 })
    .withMessage('First Name must not be greater than 25 characters.')
    .escape(),
  body('last_name', 'Last Name must not be empty.')
  .trim()
  .isLength({ min: 2 })
  .withMessage('Last Name must not be less than 2 characters.')
  .isLength({ max: 25 })
  .withMessage('Last Name must not be greater than 25 characters.')
  .escape(),
  body('username', 'Username must not be empty.')
  .trim()
  .isLength({ min: 2 })
  .withMessage('Username must not be less than 2 characters.')
  .isLength({ max: 25 })
  .withMessage('Username must not be greater than 25 characters.')
  .escape()
  .custom(async (value) => {
    const user = await User.findOne({ username: value });

    if (user) {
      throw new Error('Username already in use.');
    }
  }),
  body('email', 'Email must not be empty.')
  .trim()
  .isEmail()
  .withMessage('Email does not match.')
  .escape()
  .custom(async (value) => {
    const user = await User.findOne({ email: value });

    if (user) {
      throw new Error('Email already in use.');
    }
  }),
  body('password', 'Password must not be empty.')
  .isStrongPassword()
  .withMessage('Password is not strong enough.')
  .escape(),
  body('password_confirmation', 'Password Confirmation must not be empty.')
  .escape()
  .custom((value, { req }) => {
    return value === req.body.password;
  })
  .withMessage('Password does not match.'),
  body('admin').optional().isBoolean().toBoolean(),

  (req, res, next) => {
    const result = validationResult(req);

    bcrypt.hash(req.body.password, 10, asyncHandler(async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      })

      if (req.body.admin) {
        user.membership_status = 'Admin';
      }

      if (!result.isEmpty()) {
        res.render('signup', {
          title: 'Sign Up',
          errors: result.array()
        });
        return;
      } else {
        await user.save();
        res.redirect('/login');
      }
    }))
  }
];