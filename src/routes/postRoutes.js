const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { validatePost, validateReply } = require('../middleware/validation');
const { Post, posts } = require('../models/Post');
const { Reply, replies, postReplies } = require('../models/Reply');
const { postUpvotes } = require('../models/Upvote');

// Create post
router.post('/', authMiddleware, validatePost, (req, res) => {
  const { text } = req.body;
  const authorId = req.user.id;

  const post = new Post(text, authorId);
  posts.set(post.id, post);

  res.status(201).json(post);
});

// Add reply
router.post('/:id/replies', authMiddleware, validateReply, (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  const authorId = req.user.id;

  if (!posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const reply = new Reply(postId, authorId, text);
  replies.set(reply.id, reply);

  // Add to post replies index
  if (!postReplies.has(postId)) {
    postReplies.set(postId, new Set());
  }
  postReplies.get(postId).add(reply.id);

  // Update reply count on post
  const post = posts.get(postId);
  post.replyCount = postReplies.get(postId).size;

  res.status(201).json(reply);
});

// Upvote toggle
router.post('/:id/upvote', authMiddleware, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  if (!posts.has(postId)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Initialize upvote set for post if doesn't exist
  if (!postUpvotes.has(postId)) {
    postUpvotes.set(postId, new Set());
  }

  const upvotes = postUpvotes.get(postId);
  const hasUpvoted = upvotes.has(userId);

  // Toggle upvote
  if (hasUpvoted) {
    upvotes.delete(userId);
  } else {
    upvotes.add(userId);
  }

  // Update post upvote count
  const post = posts.get(postId);
  post.upvoteCount = upvotes.size;

  res.json({
    postId,
    upvoteCount: post.upvoteCount,
    hasUpvoted: !hasUpvoted
  });
});

module.exports = router;