import _pgp from 'pg-promise';
import fs from 'fs';

const todoTable = 'todos';
const todoGroups = 'todo_groups';
const todoUsers = 'todo_users';

const pgp = _pgp({
	connect(client, dc, useCount) {
		console.log(`Activity on: ${client.database}`);
	},

	error(err, e) {
	if (e.cn)
		console.log('Connection Error to Database');
	if (e.ctx)
		console.log('Error during transaction');
	},

	query(e) {
	console.log(`QUERY: ${e.query}`);
	}
});

const config = {
	host: 'localhost',
	port: 5432,
	database: 'todo_list',
	user: 'postgres',
	password: 'trust'
};

const db = pgp(config);

export async function getAllTasks(userId) {
	return await db.any(`SELECT * FROM ${todoTable} WHERE user_id = $1 ORDER BY id ASC`, [userId]);
}

export function insertTask(task, userId, groupId) {
	return db.none(`INSERT INTO ${todoTable} (todo, user_id, todo_group) VALUES ($1, $2, $3)`, [task, userId, groupId]);
}

export async function deleteTask(id) {
	await db.none(`DELETE FROM ${todoTable} WHERE id = $1`, [id]);
}

export async function taskDone(id) {
	await db.none(`UPDATE ${todoTable} t SET is_done=TRUE WHERE t.id = $1`, [id]);
}

export async function deleteDone(userId) {
	await db.none(`DELETE FROM ${todoTable} WHERE is_done AND user_id = $1`, [userId]);
}

export async function userExists(username) {
	return await db.one(`SELECT COUNT(*) = 1 AS exists FROM ${todoUsers} WHERE username = $1`, [username]);
}

export async function emailExists(email) {
	return await db.one(`SELECT COUNT(*) = 1 AS exists FROM ${todoUsers} WHERE email = $1`, [email]);
}

export async function insertUser(username, password, email) {
	await db.none(`INSERT INTO ${todoUsers} (username, password, email) VALUES ($1, $2, $3)`, [username, password, email]);
}

export async function getUserFromUsername(username) {
	return await db.one(`SELECT * FROM ${todoUsers} WHERE username = $1`, [username]);
}

export async function insertTodoGroup(userId, groupName) {
	await db.none(`INSERT INTO ${todoGroups} (user_id, group_name) VALUES ($1, $2)`, [userId, groupName]);
}

export async function getGroupsFromUserId(userId) {
	return await db.any(`SELECT g.id, g.group_name FROM ${todoGroups} g WHERE user_id = $1 ORDER BY g.id ASC`, [userId]);
}

export async function insertGroup(userId, groupName) {
	return await db.one(`INSERT INTO ${todoGroups} (user_id, group_name) VALUES ($1, $2) RETURNING id`, [userId, groupName]);
}

export function createTables(pathToSQL) {
	console.log(pathToSQL);
	fs.readFile(pathToSQL, 'utf8', async (err, data) => {
	if (err) throw err;
	await db.multi(data);
	});
}
