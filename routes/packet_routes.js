const express = require('express');
const router = express.Router();

const packet_controller = require('../controllers/packet_controller');

router.post('/load', packet_controller.load_packet);
router.post('/save', packet_controller.save_packet);

module.exports = router;