const express = require('express');
const router = express.Router();
const registration_controller = require('../controllers/registrationController');

router.get('/signup', registration_controller.signup_get);
router.post('/signup', registration_controller.signup_post);

module.exports = router;