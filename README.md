# Social Feed Backend

A RESTful API backend for a social feed application with cursor pagination, replies, and upvote functionality.

## How to Run the Project

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-feed-backend

2. **Install dependencies**
   ```bash
    npm install

3. **Start the server**
   ```bash
    # Development mode with auto-reload
    npm run dev

    # Production mode
    npm start

4. **Server will run on**
    ```bash
    http://localhost:3000

How Cursor Pagination Works
Cursor pagination uses the last item's ID as a marker for fetching the next set of results:

First request: No cursor provided, returns first N items (sorted by newest first)

Response includes: Items array and nextCursor (ID of last item)

Next request: Include the nextCursor to get the next page

Benefits:

Consistent results even if new items are added

Better performance than offset pagination for large datasets

No skipped or duplicate items

Example flow:

text
GET /feed?limit=2
→ Returns items [post3, post2] with nextCursor="post2"
GET /feed?cursor=post2&limit=2
→ Returns items [post1, post0] with nextCursor="post0"
GET /feed?cursor=post0&limit=2
→ Returns items [] with nextCursor=null
How Upvote Uniqueness is Ensured
Upvote uniqueness is maintained using a Set data structure:

javascript
// Key: postId, Value: Set of userIds
const postUpvotes = new Map();
This ensures:

Each user can only upvote once per post (Set guarantees uniqueness)

O(1) lookup for checking if user has upvoted

Atomic toggle operations

No duplicate upvotes even with concurrent requests

Production Database Choice
For production, I would use PostgreSQL with the following schema:

sql
-- Users table
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id VARCHAR(50) PRIMARY KEY,
  text TEXT NOT NULL,
  author_id VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  upvote_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  INDEX idx_created_at (created_at DESC)
);

-- Replies table
CREATE TABLE replies (
  id VARCHAR(50) PRIMARY KEY,
  post_id VARCHAR(50) REFERENCES posts(id) ON DELETE CASCADE,
  author_id VARCHAR(50) REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_post_created (post_id, created_at DESC)
);

-- Upvotes table (junction table for many-to-many)
CREATE TABLE upvotes (
  post_id VARCHAR(50) REFERENCES posts(id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id),
  INDEX idx_user_post (user_id, post_id)
);
Why PostgreSQL?

ACID compliance: Ensures data integrity for upvotes

JSON support: Can store additional flexible metadata

Powerful indexing: Supports efficient pagination with composite indexes

Mature ecosystem: Great tools, monitoring, and scaling options

Concurrency handling: Handles multiple upvotes without conflicts

Foreign key constraints: Maintains referential integrity

text

### Step 9: Testing with curl commands

```bash
# 1. Mock Login
curl -X POST http://localhost:3000/auth/mock \
  -H "Content-Type: application/json" \
  -d '{"userId": "u1"}'

# 2. Create Posts (using token from step 1)
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer mock-u1" \
  -H "Content-Type: application/json" \
  -d '{"text": "First post!"}'

curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer mock-u1" \
  -H "Content-Type: application/json" \
  -d '{"text": "Second post"}'

curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer mock-u1" \
  -H "Content-Type: application/json" \
  -d '{"text": "Third post"}'

# 3. Get Feed (first page)
curl "http://localhost:3000/feed?limit=2"

# 4. Get Feed with cursor (second page)
# Replace <cursor> with nextCursor from previous response
curl "http://localhost:3000/feed?cursor=<cursor>&limit=2"

# 5. Add Reply
curl -X POST http://localhost:3000/posts/p_123/replies \
  -H "Authorization: Bearer mock-u1" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great post!"}'

# 6. Upvote Toggle
curl -X POST http://localhost:3000/posts/p_123/upvote \
  -H "Authorization: Bearer mock-u1"

# 7. Upvote again (removes upvote)
curl -X POST http://localhost:3000/posts/p_123/upvote \
  -H "Authorization: Bearer mock-u1"