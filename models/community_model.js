const db = require('../db/connect');

const Community = function (feed) {
  this.feed_id = feed.feed_id;
  this.user_id = feed.user_id;
  this.content = feed.feed_text;
  this.imageUrl = feed.imageUrl;
  this.created_at = feed.created_at;
  this.updated_at = feed.updated_at;
  this.like_count = feed.like_count;
};
