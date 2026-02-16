const express = require('express');
const router = express.Router();

router.post('/mock', (req, res) => {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required' });
  }

  res.json({ token: `mock-${userId}` });
});

module.exports = router;