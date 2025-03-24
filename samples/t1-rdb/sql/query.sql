SELECT * FROM users LEFT JOIN posts ON users.id = posts.creator_id WHERE users.id = 1;
