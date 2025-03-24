SELECT * FROM users LEFT JOIN posts ON posts.creator_id = posts.id WHERE users.id = 1;
SELECT * FROM posts WHERE EXISTS (SELECT * FROM liked WHERE liked.user_id = 1 AND posts.id = liked.post_id);
