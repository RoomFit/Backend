const Feed = require('../models/community_model');

const post_feed = (req, res) => {
  console.log(req.body.content);

  const current_date = new Date().toLocaleString();
  const new_feed = new Feed({
    user_id: req.body.user_id,
    feed_content: req.body.feed_content,
    imageUrl: req.body.imageUrl,
    created_at: current_date,
    updated_at: current_date,
    like_count: 0,
  });
  console.log(new_feed);

  Feed.create(new_feed, (err, id) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating new feed.',
        success: 0,
      });
    else {
      res.json({
        feed_id: id,
        success: 1,
      });
    }
  });
};

module.exports = {
  post_feed,
};
