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
      workout_id,
      title,
      DATE(start_time) AS date,
      start_time,
      end_time,
      time(strftime('%s', datetime(end_time)) - strftime('%s', datetime(start_time)), 'unixepoch') AS total_time,
      (
        SELECT SUM(set_info.weight * set_info.rep)
        FROM set_info
        WHERE set_info.record_id IN (
          SELECT record_id
          FROM record
          WHERE record.workout_id = workout.workout_id
        )
      ) AS total_weight,
      (
        SELECT json_group_array(DISTINCT motion.major_target)
        FROM motion
        WHERE motion.motion_id IN (
          SELECT motion_id
          FROM record
          WHERE record.workout_id = workout.workout_id
        )
      ) AS targets,
      memo
    FROM workout
    WHERE user_id = ?
  `;

  if (recent)
    query += `AND DATE(start_time) = (
      SELECT MAX(DATE(start_time))
      FROM workout
      WHERE end_time != ''
    )
  `;

  query += `AND end_time != ''
  ORDER BY start_time DESC`;

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
Workout.calender_date = (user_id, date, callback) => {
  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;
  var query = `
    SELECT 
      workout_id,
      title,
      start_time,
      end_time,
      time(strftime('%s', datetime(end_time)) - strftime('%s', datetime(start_time)), 'unixepoch') AS total_time,
      (
        SELECT SUM(set_info.weight * set_info.rep)
        FROM set_info
        WHERE set_info.record_id IN (
          SELECT record_id
          FROM record
          WHERE record.workout_id = workout.workout_id
        )
      ) AS total_weight,
      (
        SELECT json_group_array(DISTINCT motion.major_target)
        FROM motion
        WHERE motion.motion_id IN (
          SELECT motion_id
          FROM record
          WHERE record.workout_id = workout.workout_id
        )
      ) AS targets,
      memo
    FROM workout
    WHERE user_id = ? AND start_time>= ? AND start_time <= ?
  `;
  query += `AND end_time != ''
  ORDER BY start_time DESC`;
  db.all(query, [user_id, startDate, endDate], (err, rows) => {
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

Workout.calender_month = (user_id, month, callback) => {
  const startDate = `${month}-01 00:00:00`;
  const endDate = `${month}-31 23:59:59`;
  const sql = `SELECT start_time FROM workout WHERE user_id = ? AND start_time>= ? AND start_time <= ? AND end_time != ''`;
  db.all(sql, [user_id, startDate, endDate], (err, rows) => {
    if (err) console.error(err);
    console.log(rows);
    callback(rows);
  });
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
  const condition_query = `
    FROM workout
    WHERE user_id = ?
    AND julianday(date('now', 'localtime')) - julianday(date(start_time)) <= ?
    AND end_time != ''`;
  const queries = {
    total_time:
      `SELECT time(SUM(strftime('%s', datetime(end_time)) - strftime('%s', datetime(start_time))), 'unixepoch')` +
      condition_query,
    tut: `SELECT time(SUM(strftime('%s',tut)), 'unixepoch')` + condition_query,
    count: `SELECT COUNT(*)` + condition_query,
  };
  const weight_percentage_query = `
    SELECT weight * rep AS weight, (
      SELECT major_target
      FROM motion
      WHERE motion_id IN (
        SELECT motion_id
        FROM record
        WHERE set_info.record_id = record.record_id
      )
    ) AS targets
    FROM set_info
    WHERE record_id NOT NULL
  `;
  var weight = 0;
  var percent = {
    shoulder: 0,
    back: 0,
    chest: 0,
    core: 0,
    forearm: 0,
    upper_arm: 0,
    leg: 0,
    etc: 0,
  };
  db.all(weight_percentage_query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    for (row of rows) {
      const target_arr = row.targets.split(', ');
      weight += row.weight;
      const len = target_arr.length;
      for (tar of target_arr) {
        if (tar == 'Waist') percent.core += row.weight / len;
        else if (tar == 'Chest') percent.chest += row.weight / len;
        else if (tar == 'Shoulders') percent.shoulder += row.weight / len;
        else if (tar == 'Back') percent.back += row.weight / len;
        else if (tar == 'Leg') percent.leg += row.weight / len;
        else if (tar == 'Forearms') percent.forearm += row.weight / len;
        else if (tar == 'Upper Arms') percent.upper_arm += row.weight / len;
        else percent.etc += row.weight / len;
      }
    }

    Object.keys(percent).forEach(key => {
      percent[key] = (percent[key] / weight) * 100;
    });

    const data = {total_weight: weight, percentage: percent};
    Object.keys(queries).forEach(key => {
      const query = queries[key];
      db.get(query, [user_id, period], (err, row) => {
        if (err) {
          console.error(err);
          return;
        }

        data[key] = Object.values(row)[0];
        if (Object.keys(data).length == Object.keys(queries).length + 2) {
          callback(null, data);
        }
      });
    });
  });
};

module.exports = Workout;
