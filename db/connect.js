const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
  './db/roomfit.sqlite',
  sqlite3.OPEN_READWRITE,
  err => {
    if (err) console.error(err);
    else console.log('Connected to RoomFit Database');
  },
);

db.get(`PRAGMA foreign_keys = ON;`, [], err => {
  if (err) console.error(err);
  else console.log('Enabled Foreign Keys');
});

module.exports = db;
