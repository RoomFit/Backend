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
      const sqlRoutine = `SELECT routine_name, routine.routine_id, motion.body_region FROM routine_motion INNER JOIN routine ON routine.routine_id = routine_motion.routine_id INNER JOIN motion ON motion.motion_id = routine_motion.motion_id WHERE routine_motion.routine_id IN (${placeholders})`;
      db.all(sqlRoutine, routineIds, (err, routineRows) => {
        //console.log(routineRows);
        if (err) {
          console.error(err);
        } else {
          const groupedResults = {};
          routineRows.forEach(row => {
            const {routine_id, routine_name, body_region} = row;
            if (!groupedResults[routine_id]) {
              groupedResults[routine_id] = {
                routine_id: routine_id,
                routine_name: routine_name,
                body_regions: [body_region],
                motion_count: 1,
              };
            } else {
              let k = 0;
              groupedResults[routine_id].body_regions.forEach(target => {
                if (target.includes(body_region)) {
                  k = 1;
                }
              });
              if (k == 0) {
                groupedResults[routine_id].body_regions.push(body_region);
              }
              groupedResults[routine_id].motion_count++;
            }
          });
          const finalResults = Object.values(groupedResults).map(result => {
            const uniqueMajorTarget = new Set();
            result.body_regions.forEach(targets => {
              const target = targets.split(',').map(item => item.trim());
              target.forEach(tar => {
                if (!uniqueMajorTarget.has(tar)) {
                  uniqueMajorTarget.add(tar);
                }
              });
            });

            return {
              ...result,
              body_regions: [...uniqueMajorTarget].join(', '),
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
                routine.user_id,
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
               WHERE routine_motion.routine_id = ? order by set_order, set_no`;
  db.all(sql, routine_id, (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else if (rows.length > 0) {
      const datas = {
        routine_id: rows[0].routine_id,
        routine_name: rows[0].routine_name,
        motionList: [],
      };
      let rowCount = 0;
      rows.forEach(row => {
        const motionSql =
          'SELECT motion_id, motion_name, image_url FROM motion WHERE motion_id = ?';
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
                image_url: motionRows[0].image_url,
                sets: [],
                motion_range_min: -1,
                motion_range_max: -1,
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
            rowCount++;
            if (rowCount === rows.length){
              let count = 0;
              datas.motionList.forEach(list => {
                const sqlMotionRange = `SELECT motion_range_min, motion_range_max FROM motion_range WHERE motion_id = ? AND user_id = ?`;
                db.get(sqlMotionRange, [list.motion_id, row.user_id], (err, motion_range) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(motion_range);
                    list.motion_range_min = motion_range?motion_range.motion_range_min:-1;
                    list.motion_range_max = motion_range?motion_range.motion_range_max:-1;
                    count++;
                    console.log(datas.motionList.length);
                    console.log(count);
                    if(count==datas.motionList.length){
                      console.log(datas);
                      callback(null,datas);
                    }
                  }
                })
              });
            }
          }
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

Routine.save = function (user_id,routine_id, motion_list, callback) {
  for(let i = 0; i<motion_list.length; i++){
    const checkData = `SELECT * FROM motion_range WHERE user_id = ? AND motion_id = ?`;
    db.get(checkData, [user_id,motion_list[i].motion_id], (err, row)=>{
      if(row){
        const sqlUpdate = `UPDATE motion_range SET motion_range_min = ?, motion_range_max = ? WHERE motion_id = ? AND user_id = ?`;
        db.run(sqlUpdate, [motion_list[i].motion_range_min, motion_list[i].motion_range_max, motion_list[i].motion_id, user_id], (err)=>{
          if(err){
            console.error(err);
          }
        })
      }
      else{
        const sqlInsert = `INSERT INTO motion_range (user_id, motion_id, motion_range_min, motion_range_max) VALUES (?,?,?,?)`;
        db.run(sqlInsert,[user_id,motion_list[i].motion_id,motion_list[i].motion_range_min,motion_list[i].motion_range_max],(err)=>{
          if(err){
            console.error(err);
          }
        })
      }
    })
  }
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
