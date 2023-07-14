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
      const fetchData = async () => {
        try{
          const sqlFav = `SELECT * FROM motion WHERE motion_id IN (${placeholders}) AND (user_id = ? OR user_id IS NULL) ORDER BY count desc`;
          const favRows = await new Promise((resolve,reject) => {
            db.all(sqlFav, [...favoriteMotionIds,user_id], (err,favRows) => {
              if(err){
                reject(err);
              } else{
                resolve(favRows);
              }
            });
          });
          const sqlNotFav = `SELECT * FROM motion WHERE motion_id NOT IN (${placeholders}) AND (user_id = ? OR user_id IS NULL) ORDER BY count desc`;
          const notFavRows = await new Promise((resolve, reject) => {
            db.all(sqlNotFav, [...favoriteMotionIds, user_id], (err, notFavRows) => {
              if(err){
                reject(err);
              } else {
                resolve(notFavRows)
              }
            })
          });
          const fetchMotionRange = async (row) => {
            const sqlMotionRange = `SELECT motion_range_min, motion_range_max FROM motion_range WHERE motion_id = ? AND user_id = ?`;
            const motion_range = await new Promise((resolve,reject) => {
              db.get(sqlMotionRange, [row.motion_id, user_id], (err, motion_range) => {
                if(err){
                  reject(err);
                } else{
                  resolve(motion_range);
                }
              })
            });
            return {
              ...row,
              motion_range_min: motion_range?motion_range.motion_range_min:null,
              motion_range_max: motion_range?motion_range.motion_range_max:null,
            };
          };
          const favMotionList = await Promise.all(favRows.map(fetchMotionRange));
          const notFavMotionList = await Promise.all(notFavRows.map(fetchMotionRange));
          console.log(favMotionList);
          console.log(notFavMotionList);
          const motionList = [...favMotionList.map((row) => ({...row, isFav:true})), ...notFavMotionList.map((row) => ({...row, isFav: false}))];
          console.log(motionList);
          callback(null, motionList);
        } catch(err){
          console.error(err);
          callback(err);
        }
      };
      fetchData();
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

Motion.custom_motion = function (body, callback) {
  const sql = 'INSERT INTO motion (user_id, motion_name, motion_english_name,major_target,minor_target,is_one_arm,equipment,description) values (?,?,?,?,?,?,?,?)';
  db.run(sql, [body.user_id, body.motion_name, body.motion_name,body.major_target, body.minor_target,body.is_one_arm, body.equipment, body.description], function(err, result){
    if(err) console.error(err.message);
    else callback(null, result);
  });
}

Motion.add_motion = function (motion_ids, callback) {
  const placeholders = Array(motion_ids.length).fill('?').join(',');
  const sql = `SELECT motion_id, motion_name, motion_english_name, imageUrl FROM motion WHERE motion_id IN (${placeholders})`;
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
      const tempMotionList = [];
      const replaceName = motion_name.replace(/[\\ ]/g, '');
      const eng = /[a-zA-Z]/;
      if(eng.test(replaceName)){
        const fetchData = async () => {
          try {
            const sqlFav = `SELECT motion_id, motion_name, motion_english_name, major_target, minor_target, equipment, imageUrl, description FROM motion WHERE motion_id IN (${placeholders}) AND REPLACE(motion_english_name, ' ', '') LIKE ? AND (user_id = ? OR user_id IS NULL) ORDER BY count desc`;
            const favRows = await new Promise((resolve, reject) => {
              db.all(sqlFav, [...favoriteMotionIds, `%${replaceName}%`, user_id], (err, favRows) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(favRows);
                }
              });
            });
        
            const sqlNotFav = `SELECT motion_id, motion_name, motion_english_name, major_target, minor_target, equipment, imageUrl, description FROM motion WHERE motion_id NOT IN (${placeholders}) AND REPLACE(motion_english_name, ' ', '') LIKE ? AND (user_id = ? OR user_id IS NULL) ORDER BY count desc`;
            const notFavRows = await new Promise((resolve, reject) => {
              db.all(sqlNotFav, [...favoriteMotionIds, `%${replaceName}%`, user_id], (err, notFavRows) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(notFavRows);
                }
              });
            });
        
            const fetchMotionRange = async (row) => {
              const sqlMotionRange = `SELECT motion_range_min, motion_range_max FROM motion_range WHERE motion_id = ? AND user_id = ?`;
              const motion_range = await new Promise((resolve, reject) => {
                db.get(sqlMotionRange, [row.motion_id, user_id], (err, motion_range) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(motion_range);
                  }
                });
              });
        
              return {
                ...row,
                motion_range_min: motion_range? motion_range.motion_range_min:null,
                motion_range_max: motion_range? motion_range.motion_range_max:null,
              };
            };
        
            const favMotionList = await Promise.all(favRows.map(fetchMotionRange));
            const notFavMotionList = await Promise.all(notFavRows.map(fetchMotionRange));
        
            const motionList = [...favMotionList.map((row) => ({ ...row, isFav: true })), ...notFavMotionList.map((row) => ({ ...row, isFav: false }))];
        
            console.log(motionList);
            callback(null, motionList);
          } catch (err) {
            console.error(err);
            callback(err);
          }
        };
        
        fetchData();
      }
      else{
        const fetchData = async () => {
          try {
            const sqlFav = `SELECT motion_id, motion_name, motion_english_name, major_target, minor_target, equipment, imageUrl, description FROM motion WHERE motion_id IN (${placeholders}) AND (user_id = ? OR user_id IS NULL) ORDER BY count desc`;
            const favRows = await new Promise((resolve, reject) => {
              db.all(sqlFav, [...favoriteMotionIds, user_id], (err, favRows) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(favRows);
                }
              });
            });
        
            if (replaceName.length === 0) {
              favRows.forEach(row => {
                tempMotionList.push({
                  ...row,
                  isFav: true
                });
              });
            } else if (Hangul.isConsonantAll(replaceName)) {
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
                  tempMotionList.push({
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
                  tempMotionList.push({
                    ...row,
                    isFav: true
                  });
                }
              });
            }
        
            const sqlNotFav = `SELECT motion_id, motion_name, motion_english_name, major_target, minor_target, equipment, imageUrl, description FROM motion WHERE motion_id NOT IN (${placeholders}) AND (user_id = ? OR user_id IS NULL) ORDER BY count desc`;
            const notFavRows = await new Promise((resolve, reject) => {
              db.all(sqlNotFav, [...favoriteMotionIds, user_id], (err, notFavRows) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(notFavRows);
                }
              });
            });
        
            if (replaceName.length === 0) {
              notFavRows.forEach(row => {
                tempMotionList.push({
                  ...row,
                  isFav: false
                });
              });
            } else if (Hangul.isConsonantAll(replaceName)) {
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
                  tempMotionList.push({
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
                  tempMotionList.push({
                    ...row,
                    isFav: false
                  });
                }
              });
            }
            const fetchMotionRange = async (row) => {
              const sqlMotionRange = `SELECT motion_range_min, motion_range_max FROM motion_range WHERE motion_id = ? AND user_id = ?`;
              const motion_range = await new Promise((resolve, reject) => {
                db.get(sqlMotionRange, [row.motion_id, user_id], (err, motion_range) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(motion_range);
                  }
                });
              });
        
              return {
                ...row,
                motion_range_min: motion_range? motion_range.motion_range_min:null,
                motion_range_max: motion_range? motion_range.motion_range_max:null,
              };
            };
            const motionList = await Promise.all(tempMotionList.map(fetchMotionRange));
            console.log(motionList);
            callback(null, motionList);
          } catch (err) {
            console.error(err);
            callback(err);
          }
        };
        
        fetchData();  
      
      }
    }
  });
};

module.exports = Motion;
