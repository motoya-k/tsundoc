-- name: GetBook :one
SELECT id, title, author, description, tags, content, url, user_id, created_at, updated_at
FROM books 
WHERE id = $1 AND user_id = $2;

-- name: GetBooksByUser :many
SELECT id, title, author, description, tags, content, url, user_id, created_at, updated_at
FROM books 
WHERE user_id = $1
ORDER BY updated_at DESC;

-- name: SearchBooks :many
SELECT id, title, author, description, tags, content, url, user_id, created_at, updated_at
FROM books 
WHERE user_id = $1 
  AND (
    title ILIKE '%' || $2 || '%' 
    OR description ILIKE '%' || $2 || '%'
    OR $2 = ANY(tags)
  )
ORDER BY updated_at DESC;

-- name: CreateBook :one
INSERT INTO books (title, author, description, tags, content, url, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, title, author, description, tags, content, url, user_id, created_at, updated_at;

-- name: UpdateBook :one
UPDATE books 
SET title = $2, author = $3, description = $4, tags = $5, content = $6, url = $7, updated_at = NOW()
WHERE id = $1 AND user_id = $8
RETURNING id, title, author, description, tags, content, url, user_id, created_at, updated_at;

-- name: DeleteBook :exec
DELETE FROM books 
WHERE id = $1 AND user_id = $2;