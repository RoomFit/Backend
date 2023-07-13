const db = require('../db/connect');

const Feed = function (feed) {
  this.feed_id = feed.feed_id;
  this.user_id = feed.user_id;
  this.feed_content = feed.feed_content;
  this.imageUrl = feed.imageUrl;
  this.created_at = feed.created_at;
  this.updated_at = feed.updated_at;
  this.like_count = feed.like_count;
};

Feed.create = (new_feed, callback) => {
  console.log(new_feed);
  const sql = 'INSERT INTO favorite (user_id, motion_id) values (?,?)';
  db.serialize(() => {
    db.run(
      'INSERT INTO feed (user_id,feed_content,imageUrl,created_at,updated_at,like_count) values (?,?,?,?,?,?)',
      new_feed.user_id,
      new_feed.feed_content,
      new_feed.imageUrl,
      new_feed.created_at,
      new_feed.updated_at,
      new_feed.like_count,
      function (err) {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        }
        const feedId = this.lastID;
        callback(null, feedId);
      },
    );
  });
};

Feed.getAll = callback => {
  db.serialize(() => {
    db.all('SELECT * FROM feed', (err, rows) => {
      if (err) {
        console.log('error: ', err);
        callback(err, null);
        return;
      } else {
        console.log(rows);
        callback(null, rows);
      }
    });
  });
};
module.exports = Feed;
