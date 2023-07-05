const db = require('../db/connect');

const Packet = function (packet) {
    this.record_id = packet.record_id;
    this.time = packet.time;
    this.left = packet.left;
    this.right = packet.right;
}

Packet.load = function(record_id, callback){

}

module.exports = Packet;