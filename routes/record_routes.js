const express = require('express');
const router = express.Router();
const record_controller = require('../controllers/record_controller');

router.get('/:workout_id', record_controller.record_grouped);
router.post('/', record_controller.create_record);
router.delete('/delete/:record_id', record_controller.delete_record);

module.exports = router;
