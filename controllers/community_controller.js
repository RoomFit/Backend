const Feed = require('../models/community_model');

const post_feed = (req, res) => {
  const current_date = new Date().toLocaleString();
  const new_feed = new Feed({
    user_id: req.body.user_id,
    feed_content: req.body.feed_content,
    imageUrl: req.body.imageUrl,
    created_at: current_date,
    updated_at: current_date,
    like_count: 0,
  });

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

const get_feed = (req, res) => {
  Feed.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving feeds.',
        success: 0,
      });
    else {
      res.json({
        feed_data: data,
        success: 1,
      });
    }
  });
};

module.exports = {
  post_feed,
  get_feed,
};
