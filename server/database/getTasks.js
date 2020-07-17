import _pgp from 'pg-promise';
import process from 'process';

const todoTable = 'todos';
const todoGroups = 'todo_groups';
const todoUsers = 'todo_users';

const QueryFile = _pgp.QueryFile;
const TransactionMode = _pgp.txMode.TransactionMode;
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

const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

const txMode = new TransactionMode();

export async function getAllTasks(userId) {
	return await db.any(`SELECT * FROM ${todoTable} WHERE user_id = $1 ORDER BY id ASC`, [userId]);
}

export async function getTaskByGroupId(userId, groupId) {
	return await db.any(`SELECT * FROM ${todoTable} WHERE user_id = $1 AND todo_group = $2 ORDER BY id ASC`, [userId, groupId]);
}

export async function getDefaultTasks(userId) {
	return await db.any(`SELECT id, todo, is_done FROM ${todoTable} WHERE todo_group = (SELECT MIN(todo_group) FROM ${todoTable} WHERE user_id = $1) ORDER BY id ASC`, [userId]);
}

export async function insertTask(task, userId, groupId) {
	return await db.tx({ mode: txMode }, async t => {
		db.none(`INSERT INTO ${todoTable} (todo, user_id, todo_group) VALUES ($1, $2, $3)`, [task, userId, groupId]);
	}).then(() => true)
		.catch(err => {
			console.log(err);
			return false
		});
}

export async function deleteTask(id) {
	await db.none(`DELETE FROM ${todoTable} WHERE id = $1`, [id]);
}

export async function taskDone(userId, id) {
	return await db.tx({ mode: txMode }, t => {
		return db.oneOrNone(`UPDATE ${todoTable} t SET is_done = TRUE WHERE t.id = $2 AND t.user_id = $1 RETURNING TRUE`, [userId, id]);
	}).then(res => res != null)
		.catch(err => {
			console.error(err);
			return false;
	});
}

export async function deleteDone(userId) {
	await db.none(`DELETE FROM ${todoTable} WHERE is_done AND user_id = $1`, [userId]);
}

export async function userIdExists(userId) {
	return await db.one(`SELECT CASE WHEN COUNT(*) = 1 THEN TRUE ELSE FALSE END FROM ${todoUsers} WHERE id = $1`, [userId])
		.then(res => {
			return res.case;
		});
}

export async function userExists(username) {
  let exists = await db.one(`SELECT CASE WHEN COUNT(*) = 1 THEN TRUE ELSE FALSE END FROM ${todoUsers} WHERE username = $1`, [username]);
  return exists.case;
}

export async function emailExists(email) { 
  let exists = await db.one(`SELECT CASE WHEN COUNT(*) = 1 THEN TRUE ELSE FALSE END FROM ${todoUsers} WHERE email = $1`, [email]);
  return exists.case;
}

export async function insertUser(username, password, email) {
	return await db.tx({ mode: txMode }, t => {
		return t.one(`INSERT INTO ${todoUsers} (username, password, email) VALUES ($1, $2, $3) RETURNING id`, [username, password, email]).then(res => res.id);
	}).catch(err => {
		console.error(err);
		return -1;
	});
}

export async function getUserFromUsername(username) {
	return await db.one(`SELECT * FROM ${todoUsers} WHERE username = $1`, [username]);
}

export async function insertTodoGroup(userId, groupName) {
	return await db.tx({ mode: txMode }, t => {
		return t.one(`INSERT INTO ${todoGroups} (user_id, group_name) VALUES ($1, $2) RETURNING id`, [userId, groupName])
			.then(res => res.id);
	}).catch(err => {
		return -1;
	});
}

export async function getGroupsFromUserId(userId) {
	return await db.any(`SELECT g.id, g.group_name FROM ${todoGroups} g WHERE user_id = $1 ORDER BY g.id ASC`, [userId]);
}

export async function getDefaultGroupId(userId) {
	return await db.one(`SELECT MIN(id) FROM ${todoGroups} WHERE user_id = $1`, [userId]);
}

export async function updateTimestamp(userId, expiry, id) {
	let res;
	try {
		res = await db.oneOrNone(`UPDATE ${todoTable} SET expiry = $2 WHERE user_id = $1 AND id = $3 RETURNING TRUE`, [userId, expiry, id]);
	} catch (err) {
		console.error(err);
		return false;
	}
	return !(res == null);
}

export async function deleteGroup(userId, groupId) {
	return db.tx({ mode: txMode }, t => {
		return t.none(`DELETE FROM ${todoTable} WHERE user_id = $1 AND todo_group = $2`, [userId, groupId]).
			then(() => {
				return t.oneOrNone(`DELETE FROM ${todoGroups} WHERE user_id = $1 AND id = $2 RETURNING TRUE`, [userId, groupId])
					.then(res => res != null);
			}).catch(err => {
				console.log(err);
				return false;
			});
	});
}

export async function createTables(pathToSQL) {
	const sqlFile = new QueryFile(pathToSQL, { minify: true });

	await db.multi(sqlFile);
}
