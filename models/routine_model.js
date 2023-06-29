const db = require('../db/connect');

const Routine = function (routine) {
  this.user_id = routine.user_id;
  this.routine_name = routine.routine_name;
};

Routine.create = function (user_id, callback) {
  const sql = 'INSERT INTO routine (user_id) values (?)';
  db.run(sql, user_id, function (err) {
    if (err) console.error(err.message);
    callback(null, this.lastID);
  });
};

Routine.load = function (user_id, limit = false, callback) {
  const sql = !limit
    ? 'SELECT routine_id from routine where user_id=?'
    : 'SELECT routine_id from routine where user_id=? limit 2';
  db.all(sql, user_id, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      const routineIds = rows.map(row => row.routine_id);
      const placeholders = routineIds.map(() => '?').join(',');
      const sqlRoutine = `SELECT routine_name, routine.routine_id, motion.major_target FROM routine_motion INNER JOIN routine ON routine.routine_id = routine_motion.routine_id INNER JOIN motion ON motion.motion_id = routine_motion.motion_id WHERE routine_motion.routine_id IN (${placeholders})`;
      db.all(sqlRoutine, routineIds, (err, routineRows) => {
        //console.log(routineRows);
        if (err) {
          console.error(err);
        } else {
          const groupedResults = {};
          routineRows.forEach(row => {
            const {routine_id, routine_name, major_target} = row;
            if (!groupedResults[routine_id]) {
              groupedResults[routine_id] = {
                routine_id: routine_id,
                routine_name: routine_name,
                major_targets: [major_target],
                motion_count: 1,
              };
            } else {
              let k = 0;
              groupedResults[routine_id].major_targets.forEach(target => {
                if (target.includes(major_target)) {
                  k = 1;
                }
              });
              if (k == 0) {
                groupedResults[routine_id].major_targets.push(major_target);
              }
              groupedResults[routine_id].motion_count++;
            }
          });
          const finalResults = Object.values(groupedResults).map(result => {
            const uniqueMajorTarget = new Set();
            result.major_targets.forEach(targets => {
              const target = targets.split(',').map(item => item.trim());
              target.forEach(tar => {
                if (!uniqueMajorTarget.has(tar)) {
                  uniqueMajorTarget.add(tar);
                }
              });
            });

            return {
              ...result,
              major_targets: [...uniqueMajorTarget].join(', '),
            };
          });
          finalResults.sort((a, b) => b.routine_id - a.routine_id);
          callback(null, finalResults);
        }
      });
    }
  });
};

Routine.detail = function (routine_id, callback) {
  const sql = `SELECT
                routine.routine_id,
                routine.routine_name,
                routine_motion.motion_id,
                routine_motion.routine_motion_id,
                set_info.set_id,
                set_info.set_no,
                set_info.weight,
                set_info.rep,
                set_info.mode
               FROM routine_motion INNER JOIN routine ON routine.routine_id = routine_motion.routine_id
               INNER JOIN set_info ON set_info.routine_motion_id = routine_motion.routine_motion_id
               WHERE routine_motion.routine_id = ?`;
  db.all(sql, routine_id, (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else if(rows.length > 0){
      const datas = {
        routine_id: rows[0].routine_id,
        routine_name: rows[0].routine_name,
        motionList: [],
      };
      let rowCount = 0;
      rows.forEach(row => {
        const motionSql =
          'SELECT motion_id, motion_name, imageUrl FROM motion WHERE motion_id = ?';
        const {routine_motion_id, set_id, set_no, weight, rep, mode} = row;
        db.all(motionSql, row.motion_id, (err, motionRows) => {
          if (err) {
            console.error(err);
          } else {
            if (
              !datas.motionList.find(
                motion => motion.routine_motion_id === routine_motion_id,
              )
            ) {
              datas.motionList.push({
                routine_motion_id: routine_motion_id,
                motion_id: motionRows[0].motion_id,
                motion_name: motionRows[0].motion_name,
                imageUrl: motionRows[0].imageUrl,
                sets: [],
              });
            }

            datas.motionList
              .find(motion => motion.routine_motion_id === routine_motion_id)
              .sets.push({
                set_id: set_id,
                set_no: set_no,
                weight: weight,
                reps: rep,
                mode: mode,
              });
          }
          rowCount++;
          if (rowCount === rows.length) callback(null, datas);
        });
      });
    }
  });
};

Routine.delete = function (routine_ids, callback) {
  const placeholders = Array(routine_ids.length).fill('?').join(',');
  const sql = `DELETE FROM routine where routine_id IN (${placeholders})`;
  db.run(sql, routine_ids, (err, result) => {
    if (err) console.error(err.message);
    else callback(null, result);
  });
};

Routine.save = function (routine_id, motion_list, callback) {
  const sql = `DELETE FROM routine_motion where routine_id = ?`;
  db.run(sql, routine_id, (err, result) => {
    if (err) {
      console.error(err.message);
    } else {
      for (let i = 0; i < motion_list.length; i++) {
        const insertRoutineMotion = `INSERT INTO routine_motion (routine_id, motion_id, set_order) VALUES (?,?,?)`;
        db.run(
          insertRoutineMotion,
          [routine_id, motion_list[i].motion_id, i + 1],
          function (err) {
            if (err) {
              console.error(err.message);
            } else {
              const routineMotionId = this.lastID;
              for (let j = 0; j < motion_list[i].sets.length; j++) {
                const insertSet =
                  'INSERT INTO set_info (routine_motion_id, set_no, weight, rep, mode) VALUES (?,?,?,?,?)';
                db.run(
                  insertSet,
                  [
                    routineMotionId,
                    j + 1,
                    motion_list[i].sets[j].weight,
                    motion_list[i].sets[j].reps,
                    motion_list[i].sets[j].mode,
                  ],
                  err => {
                    if (err) {
                      console.error(err.message);
                    }
                  },
                );
              }
            }
          },
        );
      }
      callback(null, result);
    }
  });
};

Routine.change_name = function (routine_id, routine_name, callback) {
  const sql = 'UPDATE routine SET routine_name=? where routine_id=?';
  db.run(sql, [routine_name, routine_id], (err, result) => {
    if (err) console.error(err.message);
    else callback(null, result);
  });
  //   db.all('SELECT * FROM routine', (err, rows) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       callback(null, rows);
  //     }
  //   });
};

module.exports = Routine;
