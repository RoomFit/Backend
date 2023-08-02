const db = require('../db/connect');

const Feed = function (feed) {
  this.feed_id = feed.feed_id;
  this.user_id = feed.user_id;
  this.feed_content = feed.feed_content;
  this.image_url = feed.image_url;
  this.created_at = feed.created_at;
  this.updated_at = feed.updated_at;
  this.like_count = feed.like_count;
  this.category = feed.category;
};

Feed.create = (new_feed, callback) => {
  console.log(new_feed);
  const sql = 'INSERT INTO favorite (user_id, motion_id) values (?,?)';
  db.serialize(() => {
    db.run(
      'INSERT INTO feed (user_id,feed_content,image_url,created_at,updated_at,like_count,category) values (?,?,?,?,?,?,?)',
      new_feed.user_id,
      new_feed.feed_content,
      new_feed.image_url,
      new_feed.created_at,
      new_feed.updated_at,
      new_feed.like_count,
      new_feed.category,
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

Feed.getAll = (user_id, category, callback) => {
  if (category) {
    db.serialize(() => {
      db.all(
        `SELECT
          feed.feed_id,
          feed.feed_content,
          feed.image_url,
          feed.created_at,
          feed.updated_at,
          feed.like_count,
          feed.user_id,
          feed.category,
          user.user_name,
          CASE WHEN likes.feed_id IS NOT NULL THEN 1 ELSE 0 END AS is_like,
          (SELECT COUNT(*) FROM comment WHERE comment.feed_id = feed.feed_id) AS comment_count
        FROM feed
        JOIN user ON feed.user_id = user.user_id
        LEFT JOIN likes ON feed.feed_id = likes.feed_id AND likes.user_id = ?
        WHERE feed.category = ?
        `,
        [user_id, category.toString()],
        (err, rows) => {
          if (err) {
            console.log('error: ', err);
            callback(err, null);
          } else {
            console.log(rows);
            callback(null, rows);
          }
        },
      );
    });
  } else {
    db.serialize(() => {
      db.all(
        `SELECT
          feed.feed_id,
          feed.feed_content,
          feed.image_url,
          feed.created_at,
          feed.updated_at,
          feed.like_count,
          feed.user_id,
          feed.category,
          user.user_name,
          CASE WHEN likes.feed_id IS NOT NULL THEN 1 ELSE 0 END AS is_like,
          (SELECT COUNT(*) FROM comment WHERE comment.feed_id = feed.feed_id) AS comment_count
        FROM feed
        JOIN user ON feed.user_id = user.user_id
        LEFT JOIN likes ON feed.feed_id = likes.feed_id AND likes.user_id = ?`,
        [user_id],
        (err, rows) => {
          if (err) {
            console.log('error: ', err);
            callback(err, null);
          } else {
            console.log(rows);
            callback(null, rows);
          }
        },
      );
    });
  }
};

Feed.like = (feed_id, user_id, callback) => {
  db.serialize(() => {
    db.all(
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
                  // like like_count -1
                  db.run(
                    'UPDATE feed SET like_count = like_count - 1 WHERE feed_id = ?',
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
                } else {
                  // like like_count +1
                  const likeId = this.lastID;
                  db.run(
                    'UPDATE feed SET like_count = like_count + 1 WHERE feed_id = ?',
                    feed_id,
                    (err, rows) => {
                      if (err) {
                        console.log('error: ', err);
                        callback(err, null);
                        return;
                      } else {
                        callback(null, likeId);
                      }
                    },
                  );
                }
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
      'SELECT comment.comment_id, comment.comment_content, comment.updated_at, user.user_name, user.user_id FROM comment JOIN user ON comment.user_id = user.user_id WHERE comment.feed_id = ?',
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

Feed.deleteFeed = (feed_id, callback) => {
  db.serialize(() => {
    db.run(
      'DELETE FROM feed WHERE feed_id = ?',
      parseInt(feed_id),
      (err, rows) => {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        } else {
          callback(null, 'deleted');
        }
      },
    );
  });
};

Feed.deleteComment = (comment_id, callback) => {
  db.serialize(() => {
    db.run(
      'DELETE FROM comment WHERE comment_id = ?',
      parseInt(comment_id),
      (err, rows) => {
        if (err) {
          console.log('error: ', err);
          callback(err, null);
          return;
        } else {
          callback(null, 'deleted');
        }
      },
    );
  });
};

module.exports = Feed;
