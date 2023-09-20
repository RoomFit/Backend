const Feed = require('../models/community_model');
const upload = require('../config/multer');

const post_feed = (req, res) => {
  //console.log(req.body.content);
  //console.log(req.body.user_id);

  const current_date = new Date().toLocaleString();
  const new_feed = new Feed({
    user_id: req.body.user_id,
    feed_content: req.body.content,
    image_url: req.file ? req.file.location : null,
    created_at: current_date,
    updated_at: current_date,
    like_count: 0,
    category: req.body.category,
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
  const user_id = req.query.user_id;
  const category = req.query.category;

  Feed.getAll(user_id, category, (err, data) => {
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

const like_feed = (req, res) => {
  Feed.like(req.body.feed_id, req.body.user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while liking feed.',
        success: 0,
      });
    else {
      if (data === 'unliked') {
        res.json({
          like_id: null,
          unliked: true,
          success: 1,
        });
      } else {
        res.json({
          like_id: data,
          unliked: false,
          success: 1,
        });
      }
    }
  });
};

const get_feed_comment = (req, res) => {
  const feed_id = req.query.feed_id;
  Feed.getComment(feed_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while getting feed comment.',
        success: 0,
      });
    else {
      res.json({
        comment_data: data,
        success: 1,
      });
    }
  });
};

const post_comment = (req, res) => {
  const current_date = new Date().toLocaleString();
  const new_comment = {
    feed_id: req.body.feed_id,
    user_id: req.body.user_id,
    comment_content: req.body.comment_content,
    created_at: current_date,
    updated_at: current_date,
  };
  Feed.postComment(new_comment, (err, id) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while posting new comment.',
        success: 0,
      });
    else {
      res.json({
        comment_id: id,
        success: 1,
      });
    }
  });
};

const delete_feed = (req, res) => {
  const feed_id = req.query.feed_id;

  //console.log(feed_id);

  Feed.deleteFeed(feed_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting feed.',
        success: 0,
      });
    else {
      res.json({
        success: 1,
      });
    }
  });
};
const delete_comment = (req, res) => {
  const comment_id = req.query.comment_id;
  Feed.deleteComment(comment_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting comment.',
        success: 0,
      });
    else {
      res.json({
        success: 1,
      });
    }
  });
};

module.exports = {
  post_feed,
  get_feed,
  like_feed,
  get_feed_comment,
  post_comment,
  delete_feed,
  delete_comment,
};
