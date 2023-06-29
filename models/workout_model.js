const db = require('../db/connect');

const Workout = function (workout) {
  this.user_id = workout.user_id;
  this.end_time = workout.end_time;
  this.tut = workout.tut;
  this.title = workout.title;
  this.memo = workout.meo;
};
//Create New Workout
Workout.create = (new_workout, callback) => {
  const {user_id, end_time, tut, title, memo} = new_workout;
  db.run(
    `INSERT INTO workout (user_id, end_time, tut, title, memo) VALUES (?,?,?,?,?)`,
    [user_id, end_time, tut, title, memo],
    function (err) {
      if (err) console.error(err);
      callback(null, this.lastID);
    },
  );
};
//Update Workouts
Workout.update = (new_workout, callback) => {
  db.run(
    `UPDATE workout SET end_time = datetime('now', 'localtime'), tut = ?, title = ?, memo = ? WHERE workout_id = ?`,
    [
      new_workout.tut,
      new_workout.title,
      new_workout.memo,
      new_workout.workout_id,
    ],
    (err, res) => {
      if (err) console.error(err);
      callback(null, res);
    },
  );
};
//Get Past 10 Days Workout
Workout.recent = (user_id, callback) => {
  db.all(
    `SELECT * FROM workout WHERE user_id = ? AND julianday(date('now', 'localtime')) - julianday(date(start_time)) <= 10`,
    [user_id],
    (err, rows) => {
      if (err) console.error(err);
      else callback(null, rows);
    },
  );
};

//Get Brief Workout Information
Workout.brief = (user_id, recent = false, callback) => {
  var query = `
    SELECT 
      t.workout_id,
      t.title,
      t.start_time,
      t.end_time,
      time(strftime('%s', datetime(t.end_time)) - strftime('%s', datetime(t.start_time)), 'unixepoch') AS total_time,
      (
        SELECT SUM(set_info.weight * set_info.rep)
        FROM set_info
        WHERE set_info.record_id IN (
          SELECT record_id
          FROM record
          WHERE workout_id = t.workout_id
        )
      ) AS total_weight,
      (
        SELECT json_group_array(DISTINCT motion.major_target)
        FROM motion
        WHERE motion.motion_id IN (
          SELECT motion_id
          FROM record
          WHERE workout_id = t.workout_id
        )
      ) AS targets
    FROM (
      SELECT
        w.user_id, w.title, w.start_time, w.end_time, w.workout_id,
        s.weight, s.rep, s.record_id,
        m.major_target, m.motion_id,
        r.record_id
      FROM
        workout AS w
        JOIN record AS r
        ON r.workout_id = w.workout_id
        JOIN set_info AS s
        ON r.record_id = s.record_id
        JOIN motion AS m
        ON r.motion_id = m.motion_id
      WHERE w.user_id = ?
  `;

  if (recent)
    query += `AND DATE(w.start_time) = (
      SELECT MAX(DATE(start_time))
      FROM workout
    )
  `;

  query += `GROUP BY w.workout_id
  ) AS t
  ORDER BY t.start_time DESC`;

  db.all(query, [user_id], (err, rows) => {
    if (err) console.error(err);
    else {
      for (var i = 0; i < rows.length; i++) {
        const target_arr = JSON.parse(rows[i].targets).join(', ').split(', ');
        rows[i].targets = [...new Set(target_arr)];
      }
      console.log(rows);
      callback(null, rows);
    }
  });
};
//Get all records & sets in workout
Workout.detail = (workout_id, callback) => {
  db.all(
    `SELECT record.*, motion.motion_name, motion.imageURL, (
      SELECT json_group_array(json_object('set_no', set_info.set_no, 'weight', set_info.weight, 'rep', set_info.rep, 'mode', set_info.mode))
      FROM set_info
      WHERE set_info.record_id = record.record_id
    ) AS sets
    FROM record JOIN motion ON motion.motion_id = record.motion_id
    WHERE workout_id = ?`,
    [workout_id],
    (err, rows) => {
      if (err) console.error(err);
      else if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
          rows[i].sets = JSON.parse(rows[i].sets);
        }
        callback(null, rows);
      } else callback(null, []);
    },
  );
};

//Get Workout of speicific date
Workout.calander = (user_id, date, callback) => {
  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;

  db.all(
    `SELECT * FROM workout WHERE user_id = ? AND start_time >= ? AND start_time < ?;`,
    [user_id, startDate, endDate],
    (err, rows) => {
      if (err) console.error(err);
      callback(rows);
    },
  );
};

//Delete Workout
Workout.delete = (workout_id, callback) => {
  db.run(
    `DELETE FROM workout WHERE workout_id = ?`,
    [workout_id],
    (err, res) => {
      if (err) console.error(err);
      else callback(null, res);
    },
  );
};

//Statistics
Workout.stat = (user_id, period, callback) => {
  const condition_query = ` FROM workout WHERE user_id = ? AND julianday(date('now', 'localtime')) - julianday(date(start_time)) <= ?`;
  const queries = {
    total_time:
      `SELECT time(SUM(strftime('%s', datetime(end_time)) - strftime('%s', datetime(start_time))), 'unixepoch')` +
      condition_query,
    tut: `SELECT time(SUM(strftime('%s',tut)), 'unixepoch')` + condition_query,
    weight:
      `SELECT SUM(weight * rep) FROM set_info WHERE record_id IN (SELECT record_id FROM record WHERE workout_id in ( SELECT workout_id` +
      condition_query +
      `))`,
    count: `SELECT COUNT(*)` + condition_query,
  };

  const data = {};
  Object.keys(queries).forEach((key, index) => {
    const query = queries[key];
    db.get(query, [user_id, period], (err, row) => {
      if (err) {
        console.error(err);
        return;
      }
      data[key] = Object.values(row)[0];
      if (Object.keys(data).length == Object.keys(queries).length) {
        callback(null, data);
      }
    });
  });
};

module.exports = Workout;
