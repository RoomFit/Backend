const Feed = require('../models/community_model');
const upload = require('../config/multer');

const post_feed = (req, res) => {
  console.log(req.body.content);
  console.log(req.body.user_id);

  const current_date = new Date().toLocaleString();
  const new_feed = new Feed({
    user_id: req.body.user_id,
    feed_content: req.body.content,
    imageUrl: req.file ? req.file.location : null,
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
