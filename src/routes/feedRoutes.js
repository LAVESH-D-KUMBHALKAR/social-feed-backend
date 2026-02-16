const express = require('express');
const router = express.Router();
const { validateFeed } = require('../middleware/validation');
const { posts } = require('../models/Post');
const { getPaginatedFeed } = require('../utils/pagination');

router.get('/', validateFeed, (req, res) => {
  const { limit, cursor } = req.pagination;

  // Convert posts map to array and sort by createdAt DESC
  const allPosts = Array.from(posts.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const result = getPaginatedFeed(allPosts, limit, cursor);

  res.json(result);
});

module.exports = router;