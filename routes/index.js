const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');

/* GET home page. */
router.get('/', user_controller.index);
router.get('/join_the_club', user_controller.join_the_club_get);
router.post('/join_the_club', user_controller.join_the_club_post);
router.get('/profile/:username', user_controller.profile);

router.get('/message/create', message_controller.message_create_get);
router.post('/message/create', message_controller.message_create_post);
router.post('/message/delete', message_controller.message_delete_post);

module.exports = router;