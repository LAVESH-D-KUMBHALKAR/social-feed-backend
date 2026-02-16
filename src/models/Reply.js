const { v4: uuidv4 } = require('uuid');

class Reply {
  constructor(postId, authorId, text) {
    this.id = `r_${uuidv4()}`;
    this.postId = postId;
    this.authorId = authorId;
    this.text = text;
    this.createdAt = new Date().toISOString();
  }
}

// In-memory storage
const replies = new Map(); // key: replyId, value: Reply
const postReplies = new Map(); // key: postId, value: Set of replyIds

module.exports = { Reply, replies, postReplies };