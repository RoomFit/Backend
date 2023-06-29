const express = require('express');
const router = express.Router();
const set_controller = require('../controllers/set_controller');

router.post('/', set_controller.create_set);

module.exports = router;
