const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Message = require('../models/message');

exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('user').sort({ timestamp: -1 }).exec();

  res.render('index', {
    title: 'Members Only',
    user: req.user,
    messages: messages
  });
});

exports.profile = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username }).exec();

  if (!user) {
    const notFound = new Error('User Not Found');
    notFound.status = 404;
    throw notFound;
  }

  const messages = await Message.find({ user: user._id }).sort({ timestamp: -1 }).exec();
  res.render('profile', {
    user: user,
    currentUser: req.user,
    messages: messages
  });
});

exports.join_the_club_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).exec();
  
  res.render('join_the_club', {
    title: 'Join The Club',
    user: user
  });
});

exports.join_the_club_post = [
  body('passcode', 'Passcode must not be empty')
    .trim()
    .escape()
    .equals('The Odin Project')
    .withMessage('Passcode does not match.'),

  asyncHandler(async (req, res, next) => {
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
      res.render('join_the_club', {
        title: 'Join The Club',
        errors: result.array()
      });
      return;
    } else {
      const user = await User.findById(req.body.userid).exec();
      user.membership_status = 'Member';
      await user.save();
      res.redirect('/');
    }
  })
];