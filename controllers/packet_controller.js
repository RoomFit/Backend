const Packet = require('../models/packet_model');

const load_packet = (req, res) => {
    if (!req.body) res.status(400).send({message: 'Content can not be empty'});
    Packet.load(req.body.record_id, (err, data) => {
        if (err){
            res
                .status(500)
                .send({message: 'Some error occurred while loading packets'});
        }
        res.json(data);
    });
};

const save_packet = (req, res) => {
    if (!req.body) res.status(400).send({message: 'Content can not be empty'});
    Packet.save(req.body.record_id, req.body.time, req.body.left, req.body.right, (err, data) => {
        if (err){
            res
                .status(500)
                .send({message: 'Some error occurred while saving packets'});
        }
        res.json(data);
    });
}

module.exports = {
    load_packet,
    save_packet,
};