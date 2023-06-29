const db = require('../db/connect');

const Set = function (set) {
  this.record_id = set.record_id;
  this.routine_motion_id = set.routine_motion_id;
  this.set_no = set.set_no;
  this.weight = set.weight;
  this.reps = set.reps;
  this.mode = set.mode;
};

//Create New Set - (Set Done & New Set in Routine)
Set.create = (set, callback) => {
  db.run(
    `INSERT INTO set_info (record_id, routine_motion_id, set_no, weight, rep, mode) VALUES (?,?,?,?,?,?)`,
    [
      set.record_id,
      set.routine_motion_id,
      set.set_no,
      set.weight,
      set.reps,
      set.mode,
    ],
    (err, res) => {
      if (err) console.error(err);
      callback(null, res);
    },
  );
};

module.exports = Set;
