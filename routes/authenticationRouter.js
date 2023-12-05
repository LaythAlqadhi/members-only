const express = require('express');
const router = express.Router();
const authentication_controller = require('../controllers/authenticationController');

router.get('/login', authentication_controller.login_get);
router.post('/login', authentication_controller.login_post);
router.get('/logout', authentication_controller.logout_get);

module.exports = router;