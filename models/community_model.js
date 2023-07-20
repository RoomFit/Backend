const db = require('../db/connect');

const Feed = function (feed) {
  this.feed_id = feed.feed_id;
  this.user_id = feed.user_id;
  this.feed_content = feed.feed_content;
  this.image_url = feed.image_url;
  this.created_at = feed.created_at;
  this.updated_at = feed.updated_at;
  this.like_count = feed.like_count;
};

Feed.create = (new_feed, callback) => {
  console.log(new_feed);
  const sql = 'INSERT INTO favorite (user_id, motion_id) values (?,?)';
  db.serialize(() => {
    db.run(
      'INSERT INTO feed (user_id,feed_content,image_url,created_at,updated_at,like_count) values (?,?,?,?,?,?)',
      new_feed.user_id,
      new_feed.feed_content,
      new_feed.image_url,
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
    db.all(
      'SELECT feed.feed_id, feed.feed_content, feed.image_url, feed.created_at, feed.updated_at, feed.like_count, user.user_name FROM feed JOIN user ON feed.user_id = user.user_id;',
      (err, rows) => {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        } else {
          console.log(rows);
          callback(null, rows);
        }
      },
    );
  });
};
module.exports = Feed;
