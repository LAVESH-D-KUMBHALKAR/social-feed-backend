/**
 * Implements cursor-based pagination
 * Cursor is the post ID from which to start fetching next items
 * Since we sort by createdAt DESC, we use the cursor to find the starting point
 */
const getPaginatedFeed = (items, limit, cursor) => {
  let startIndex = 0;

  if (cursor) {
    // Find the index of the cursor post
    const cursorIndex = items.findIndex(item => item.id === cursor);
    if (cursorIndex !== -1) {
      // Start from next item after cursor
      startIndex = cursorIndex + 1;
    }
  }

  const paginatedItems = items.slice(startIndex, startIndex + limit);
  const nextCursor = paginatedItems.length === limit && startIndex + limit < items.length
    ? paginatedItems[paginatedItems.length - 1].id
    : null;

  return {
    items: paginatedItems.map(({ id, text, createdAt, upvoteCount, replyCount }) => ({
      id,
      text,
      createdAt,
      upvoteCount,
      replyCount
    })),
    nextCursor
  };
};

module.exports = { getPaginatedFeed };