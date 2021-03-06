BEGIN;

CREATE TABLE IF NOT EXISTS todo_users (
id SERIAL PRIMARY KEY,
username VARCHAR UNIQUE NOT NULL,
email VARCHAR UNIQUE NOT NULL,
password VARCHAR);
 
CREATE TABLE IF NOT EXISTS todo_groups (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
group_name varchar NOT NULL,
FOREIGN KEY (user_id) REFERENCES todo_users(id));

CREATE TABLE IF NOT EXISTS todos (
id SERIAL PRIMARY KEY,
todo TEXT NOT NULL,
is_done BOOLEAN DEFAULT FALSE,
todo_group INTEGER NOT NULL,
user_id INTEGER NOT NULL,
expiry TIMESTAMP DEFAULT NULL,
FOREIGN KEY (todo_group) REFERENCES todo_groups(id),
FOREIGN KEY (user_id) REFERENCES todo_users (id));


COMMIT;
