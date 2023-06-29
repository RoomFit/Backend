const Set = require('../models/set_model');

const create_set = (req, res) => {
  if (!req.body)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  const set = new Set({
    record_id: req.body.record_id,
    routine_motion_id: req.body.routine_motion_id,
    set_no: req.body.set_no,
    weight: req.body.weight,
    reps: req.body.reps,
    mode: req.body.mode,
  });

  Set.create(set, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Set.',
      });
    else res.json(data);
  });
};

module.exports = {create_set};
