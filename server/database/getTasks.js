import _pgp from 'pg-promise';
import fs from 'fs';

const tableName = 'todos';
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
  return await db.any(`SELECT * FROM ${tableName} WHERE user_id = $1 ORDER BY id ASC`, [userId]);
}

export function insertTask(task, userId) {
  return db.none(`INSERT INTO ${tableName} (todo, user_id) VALUES ($1, $2)`, [task, userId]);
}

export async function deleteTask(id) {
  await db.none(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
}

export async function taskDone(id) {
  await db.none(`UPDATE ${tableName} t SET is_done=TRUE WHERE t.id = $1`, [id]);
}

export async function deleteDone(userId) {
	await db.none(`DELETE FROM ${tableName} WHERE is_done AND user_id = $1`, [userId]);
}

export function createTables(pathToSQL) {
  console.log(pathToSQL);
  fs.readFile(pathToSQL, 'utf8', async (err, data) => {
	if (err) throw err;
	await db.multi(data);
  });
}
