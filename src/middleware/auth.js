const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer mock-')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-', '');

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = { id: userId };
  next();
};

module.exports = authMiddleware;