const express = require('express');
const router = express.Router();

const community_controller = require('../controllers/community_controller');

// router.post('/', motion_controller.load_motions);
router.post('/post-feed', community_controller.post_feed);
module.exports = router;
