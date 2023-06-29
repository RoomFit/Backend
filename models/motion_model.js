const db = require('../db/connect');
const Hangul = require('hangul-js');

const Motion = function (motion) {
  this.motion_id = motion.motion_id;
  this.motion_name = motion.motion_name;
  this.major_target = motion.major_target;
  this.minor_target = motion.minor_target;
  this.equipment = motion.equipment;
  this.imageURL = motion.imageURL;
  this.description = motion.description;
  this.count = motion.count;
};

Motion.load = function (user_id, callback) {
  const sql = 'SELECT * FROM favorite WHERE user_id = ?';
  db.all(sql, user_id, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      const favoriteMotionIds = rows.map(row => row.motion_id);
      const placeholders = favoriteMotionIds.map(() => '?').join(',');
      const motionList = [];
      const sqlFav = `SELECT * FROM motion WHERE motion_id IN (${placeholders}) ORDER BY count desc`;
      db.all(sqlFav, favoriteMotionIds, (err, favRows) => {
        if (err) {
          console.error(err);
        } else {
          favRows.forEach(row => {
            motionList.push({
              ...row,
              isFav: true
            });
          });
          const sqlNotFav = `SELECT * FROM motion WHERE motion_id NOT IN (${placeholders}) ORDER BY count desc`;
          db.all(sqlNotFav, favoriteMotionIds, (err, notFavRows) => {
            if (err) {
              console.error(err);
            } else {
              notFavRows.forEach(row => {
              motionList.push({
                ...row,
                isFav: false
              });
            });
              callback(null, motionList);
            }
          });
        }
      });
    }
  });
};

Motion.add_fav = function (user_id, motion_id, callback) {
  const sql = 'INSERT INTO favorite (user_id, motion_id) values (?,?)';
  db.run(sql, [user_id, motion_id], function (err, result) {
    if (err) console.error(err.message);
    else callback(null, result);
  });
};

Motion.del_fav = function (user_id, motion_id, callback) {
  const sql = 'DELETE FROM favorite where motion_id =? AND user_id=?';
  db.run(sql, [motion_id, user_id], function (err, result) {
    if (err) console.error(err.message);
    else callback(null, result);
  });
};

Motion.add_motion = function (motion_ids, callback) {
  const placeholders = Array(motion_ids.length).fill('?').join(',');
  const sql = `SELECT motion_id, motion_name, imageUrl FROM motion WHERE motion_id IN (${placeholders})`;
  db.all(sql, motion_ids, (err, rows) => {
    if (err) console.error(err);
    else callback(null, rows);
  });
};

Motion.search_motion = function (user_id, motion_name, callback) {
  const sql = 'SELECT * FROM favorite WHERE user_id = ?';
  db.all(sql, user_id, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      const favoriteMotionIds = rows.map(row => row.motion_id);
      const placeholders = favoriteMotionIds.map(() => '?').join(',');
      const motionList = [];
      const replaceName = motion_name.replace(/[\\ ]/g, '');
      const sqlFav = `SELECT motion_id, motion_name, major_target, minor_target, equipment, imageUrl, description FROM motion WHERE motion_id IN (${placeholders}) ORDER BY count desc`;
      db.all(sqlFav, favoriteMotionIds, (err, favRows) => {
        if (err) {
          console.error(err);
        } else {
          if(replaceName.length===0){
            favRows.forEach(row => {
              motionList.push({
                ...row,
                isFav: true
              });
            });
          }
          else if (Hangul.isConsonantAll(replaceName)) {
            favRows.forEach(row => {
              const dbMotionName = Hangul.disassemble(
                row.motion_name.replace(/ /g, ''),
              );
              let dbCho = [];
              for (let i = 1; i < dbMotionName.length; i++) {
                if (Hangul.isVowel(dbMotionName[i])) {
                  if (Hangul.isCho(dbMotionName[i - 1])) {
                    dbCho += dbMotionName[i - 1];
                  }
                }
              }
              if (Hangul.rangeSearch(dbCho, replaceName).length != 0) {
                motionList.push({
                  ...row,
                  isFav: true
                });
              }
            });
          } else {
            favRows.forEach(row => {
              if (
                Hangul.rangeSearch(
                  row.motion_name.replace(/ /g, ''),
                  replaceName,
                ).length != 0
              ) {
                motionList.push({
                  ...row,
                  isFav: true
                });
              }
            });
          }
          const sqlNotFav = `SELECT motion_id, motion_name, major_target, minor_target, equipment, imageUrl, description FROM motion WHERE motion_id NOT IN (${placeholders}) ORDER BY count desc`;
          db.all(sqlNotFav, favoriteMotionIds, (err, notFavRows) => {
            if (err) {
              console.error(err);
            } else {
              if(replaceName.length===0){
                notFavRows.forEach(row => {
                  motionList.push({
                    ...row,
                    isFav: false
                  });
                });
              }
              else if (Hangul.isConsonantAll(replaceName)) {
                notFavRows.forEach(row => {
                  const dbMotionName = Hangul.disassemble(
                    row.motion_name.replace(/ /g, ''),
                  );
                  let dbCho = [];
                  for (let i = 1; i < dbMotionName.length; i++) {
                    if (Hangul.isVowel(dbMotionName[i])) {
                      if (Hangul.isCho(dbMotionName[i - 1])) {
                        dbCho += dbMotionName[i - 1];
                      }
                    }
                  }
                  if (Hangul.rangeSearch(dbCho, replaceName).length != 0) {
                    motionList.push({
                      ...row,
                      isFav: false
                    });
                  }
                });
              } else {
                notFavRows.forEach(row => {
                  if (
                    Hangul.rangeSearch(
                      row.motion_name.replace(/ /g, ''),
                      replaceName,
                    ).length != 0
                  ) {
                    motionList.push({
                      ...row,
                      isFav: false
                    });
                  }
                });
              }
              callback(null, motionList);
            }
          });
        }
      });
    }
  });
};

module.exports = Motion;
