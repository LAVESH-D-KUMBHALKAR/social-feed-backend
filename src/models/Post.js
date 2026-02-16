const { v4: uuidv4 } = require('uuid');

class Post {
  constructor(text, authorId) {
    this.id = `p_${uuidv4()}`;
    this.text = text;
    this.authorId = authorId;
    this.createdAt = new Date().toISOString();
    this.upvoteCount = 0;
    this.replyCount = 0;
  }
}

// In-memory storage
const posts = new Map(); // key: postId, value: Post

module.exports = { Post, posts };