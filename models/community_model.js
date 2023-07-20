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

Feed.like = (feed_id, user_id, callback) => {
  db.serialize(() => {
    db.run(
      'SELECT * FROM Likes WHERE user_id = ? AND feed_id = ?',
      user_id,
      feed_id,
      (err, rows) => {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        } else {
          if (rows.length > 0) {
            db.run(
              'DELETE FROM Likes WHERE user_id = ? AND feed_id = ?',
              user_id,
              feed_id,
              (err, rows) => {
                if (err) {
                  console.log('error: ', err);
                  callback(err, null);
                  return;
                } else {
                  callback(null, 'unliked');
                }
              },
            );
          } else {
            const created_at = new Date().toLocaleString();
            db.run(
              'INSERT INTO Likes (user_id,feed_id,created_at) values (?,?,?)',
              user_id,
              feed_id,
              created_at,
              function (err) {
                if (err) {
                  console.log('error: ', err);
                  callback(err, null);
                  return;
                }
                const likeId = this.lastID;
                callback(null, likeId);
              },
            );
          }
        }
      },
    );
  });
};

Feed.getComment = (feed_id, callback) => {
  db.serialize(() => {
    db.all(
      'SELECT comment.comment_id, comment.comment_content, comment.updated_at, user.user_name FROM comment JOIN user ON comment.user_id = user.user_id WHERE comment.feed_id = ?',
      feed_id,
      (err, rows) => {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        } else {
          callback(null, rows);
        }
      },
    );
  });
};

Feed.postComment = (new_comment, callback) => {
  db.serialize(() => {
    db.run(
      'INSERT INTO comment (user_id,feed_id,comment_content,created_at,updated_at) values (?,?,?,?,?)',
      new_comment.user_id,
      new_comment.feed_id,
      new_comment.comment_content,
      new_comment.created_at,
      new_comment.updated_at,
      function (err) {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        }
        const commentId = this.lastID;
        callback(null, commentId);
      },
    );
  });
};

module.exports = Feed;
