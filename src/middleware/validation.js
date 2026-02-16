const Joi = require('joi');

const validatePost = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required().min(1).max(500)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const validateReply = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required().min(1).max(300)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const validateFeed = (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  
  if (limit > 50) {
    return res.status(400).json({ error: 'Limit cannot exceed 50' });
  }

  if (limit < 1) {
    return res.status(400).json({ error: 'Limit must be at least 1' });
  }

  req.pagination = {
    limit: Math.min(limit, 50),
    cursor: req.query.cursor || null
  };

  next();
};

module.exports = { validatePost, validateReply, validateFeed };