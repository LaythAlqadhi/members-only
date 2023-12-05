const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Message = require('../models/message');

exports.message_create_get = (req, res, next) => {
  const user = req.user
  res.render('message_create', {
    title: 'Create Message',
    user: user
  });
};

exports.message_create_post = [
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title must not be less than 2 characters.')
    .isLength({ max: 50 })
    .withMessage('Title must not be greater than 50 characters.')
    .escape(),
  body('text', 'Text must not be empty.')
  .trim()
  .isLength({ min: 2 })
  .withMessage('Text must not be less than 2 characters.')
  .isLength({ max: 500 })
  .withMessage('Text must not be greater than 500 characters.')
  .escape(),

  asyncHandler(async (req, res, next) => {
    const result = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.body.userid
    });

    if (!result.isEmpty()) {
      res.render('message_create', {
        title: 'Create Message',
        user: user,
        errors: result.array()
      });
      return;
    } else {
      await message.save();
      res.redirect(req.user.url);
    }
  })
];

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.messageid);
  res.redirect('/');
});