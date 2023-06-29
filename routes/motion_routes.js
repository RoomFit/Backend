const express = require('express');
const router = express.Router();

const motion_controller = require('../controllers/motion_controller');

router.post('/', motion_controller.load_motions);
router.post('/add', motion_controller.add_motions);
router.post('/favInsert', motion_controller.add_fav_motion);
router.post('/favDelete', motion_controller.del_fav_motion);
router.post('/search', motion_controller.search_motions);
module.exports = router;
