BEGIN;

CREATE TABLE todo_users (
id SERIAL,
username VARCHAR,
email VARCHAR,
password VARCHAR);
 
ALTER TABLE todo_users ADD PRIMARY KEY (id);

CREATE TABLE todos (
id SERIAL,
todo TEXT,
is_done BOOLEAN DEFAULT FALSE,
user_id INTEGER);

ALTER TABLE todos ADD PRIMARY KEY (id);

ALTER TABLE todos ADD FOREIGN KEY (user_id) REFERENCES todo_users (id);

COMMIT;
