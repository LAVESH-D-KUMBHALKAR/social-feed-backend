// In-memory storage
const postUpvotes = new Map(); // key: postId, value: Set of userIds

module.exports = { postUpvotes };