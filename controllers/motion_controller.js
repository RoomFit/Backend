const Motion = require('../models/motion_model');

const load_motions = (req, res) => {
  if (!req.body) res.status(400).send({message: 'Content can not be empty'});
  Motion.load(req.body.user_id,(err, data) => {
    if (err){
      res
        .status(500)
        .send({message: 'Some error occurred while loading motions'});
    }
    res.json(data);
  });
};

const add_fav_motion = (req, res) => {
  if (!req.body)
    res.status(400).send({message: 'Content can not be empty'});

  Motion.add_fav(req.body.user_id, req.body.motion_id, (err, result) => {
    if (err)
      res
        .status(500)
        .send({message: 'Some error occurred while adding favorite motion'});
    res.json(result);
  });
};

const del_fav_motion = (req, res) => {
  if (!req.body)
    res.status(400).send({message: 'Content can not be empty'});

  Motion.del_fav(req.body.user_id, req.body.motion_id, (err, result) => {
    if (err)
      res
        .status(500)
        .send({message: 'Some error occurred while deleting favorite motion'});
    res.json(result);
  });
};

const add_motions = (req, res) => {
  if (!req.body) res.status(400).send({message: 'Content can not be empty'});

  Motion.add_motion(req.body.motion_ids, (err, data) => {
    if (err){
      res
        .status(500)
        .send({message: 'Some error occurred while adding motions'});
    }
    res.json(data);
  });
};

const search_motions = (req, res) => {
  if (!req.body) res.status(400).send({message: 'Content can not be empty'});
  
  Motion.search_motion(req.body.user_id, req.body.motion_name, req.body.grip?req.body.grip:[], req.body.body_region?req.body.body_region:[],(err, data) => {
    if (err)
      res
        .status(500)
        .send({message: 'Some error occurred while adding motions'});
    res.json(data);
  });
};

const custom_motions = (req, res) => {
  if(!req.body) res.status(400).send({message: 'Content can not be empty'});
  Motion.custom_motion(req.body, (err, data) => {
    if (err){
      res.status(500).send({message: 'Some error occurred while adding motions'});
    }
    res.json(data);
  });
}

const del_custom = (req, res) => {
  if(!req.body) res.status(400).send({message: 'Content can not be empty'});
  Motion.del_custom(req.body, (err, data) => {
    if(err){
      res.status(500).send({message: 'Some error occurred while deleting motions'});
    }
    res.json(data);
  });
}

module.exports = {
  load_motions,
  add_fav_motion,
  del_fav_motion,
  add_motions,
  search_motions,
  custom_motions,
  del_custom,
};
