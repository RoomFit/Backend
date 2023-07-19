const express = require('express');
const router = express.Router();
const upload = require('../config/multer');


const community_controller = require('../controllers/community_controller');

router.get('/', community_controller.get_feed);
router.post('/post-feed', upload.single('image'),community_controller.post_feed);

module.exports = router;
