const express = require('express');
const router = express.Router();

const routine_controller = require('../controllers/routine_controller');

router.post('/', routine_controller.create_routine);
router.post('/load', routine_controller.load_routine);
router.get('/detail/:routine_id', routine_controller.routine_detail);
router.put('/delete', routine_controller.delete_routine);
router.post('/save', routine_controller.save_routine);
router.put('/nameChange', routine_controller.change_routine_name);

module.exports = router;
