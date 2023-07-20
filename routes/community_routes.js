const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

const community_controller = require('../controllers/community_controller');

router.get('/', community_controller.get_feed);
router.post(
  '/post-feed',
  upload.single('image'),
  community_controller.post_feed,
);
router.put('/like-feed', community_controller.like_feed);
// router.get('/like-status', community_controller.get_like_status);
router.get('/feed-comment', community_controller.get_feed_comment);
router.post('/post-comment', community_controller.post_comment);

module.exports = router;
