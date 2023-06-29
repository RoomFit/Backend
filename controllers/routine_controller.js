const Routine = require('../models/routine_model');

const create_routine = (req, res) => {
  if (!req.body) res.status(400).send({message: 'User ID can not be empty'});

  Routine.create(req.body.user_id, (err, id) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating routine',
      });
    res.json({routine_id: id});
  });
};

const load_routine = (req, res) => {
  if (!req.body) res.status(400).send({message: 'Content can not be empty'});

  Routine.load(req.body.user_id, req.body.isHome, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while loading routines',
      });
    res.json(data);
  });
};

const routine_detail = (req, res) => {
  if (!req.params)
    res.status(400).send({message: 'Routine ID can not be empty'});

  Routine.detail(req.params.routine_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while loading routine details',
      });
    res.json(data);
  });
};

const delete_routine = (req, res) => {
  if (!req.body)
    res.status(400).send({message: 'Routine IDs can not be empty'});

  Routine.delete(req.body.routine_ids, (err, result) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting routines',
      });
    res.json(result);
  });
};

const save_routine = (req, res) => {
  if (!req.body) res.status(400).send({message: 'Content can not be empty'});

  Routine.save(req.body.routine_id, req.body.motion_list, (err, result) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occured while saving the routine',
      });
    res.json(result);
  });
};

const change_routine_name = (req, res) => {
  if (!req.body)
    res.status(400).send({message: 'Routine ID and name can not be empty'});

  Routine.change_name(
    req.body.routine_id,
    req.body.routine_name,
    (err, result) => {
      if (err)
        res.status(500).send({
          message:
            err.message || 'Some error occurred while changing routine name',
        });
      res.json(result);
    },
  );
};

module.exports = {
  create_routine,
  load_routine,
  routine_detail,
  delete_routine,
  save_routine,
  change_routine_name,
};
