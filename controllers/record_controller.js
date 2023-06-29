const Record = require('../models/record_model');

const create_record = (req, res) => {
  if (!req.body)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  const record = new Record({
    workout_id: req.body.workout_id,
    motion_id: req.body.motion_id,
  });

  Record.create(record, (err, id) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Record.',
      });
    else res.json({record_id: id});
  });
};

const record_grouped = (req, res) => {
  if (!req.params.workout_id)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  Record.group_by_workout(req.params.workout_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Record.',
      });
    else res.json(data);
  });
};

const delete_record = (req, res) => {
  if (!req.params.record_id)
    res.status(400).send({
      message: 'Content can not be empty!',
    });

  Record.delete(req.params.record_id, (err, result) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting Record.',
      });
    else res.send(result);
  });
};

module.exports = {create_record, record_grouped, delete_record};
