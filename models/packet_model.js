const db = require('../db/connect');

const Packet = function (packet) {
    this.record_id = packet.record_id;
    this.time = packet.time;
    this.left = packet.left;
    this.right = packet.right;
}

Packet.load = function(record_id, callback){
    const sql = 'SELECT * FROM packet WHERE record_id = ?';
    db.all(sql, record_id, (err, rows) => {
        if(err) console.error(err.message);
        else callback(null, rows);
    });
};

Packet.save = function(record_id, time, left, right, callback){
    const sql = 'INSERT INTO packet (record_id, time, left, right) values (?,?)';
    db.run(sql, [record_id, time, left, right], function(err, result){
        if(err) console.error(err.message);
        else callback(null, result);
    });
};

module.exports = Packet;