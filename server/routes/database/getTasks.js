import _pgp from 'pg-promise';

const tableName = 'todos';
const pgp = _pgp({
  connect(client, dc, useCount) {
	  console.log(`Activity on: ${client.database}`);
  },

  error(err, e) {
	if (e.cn)
	  console.log('Connection Error to Database');
	else if (e.ctx)
	  console.log('Error during transaction');
  }
});

const config = {
	host: 'localhost',
	port: 5432,
	database: 'todo_list',
	user: 'postgres',
	password: 'postgres'
};

const db = pgp(config);

async function getAllTasks(userId) {
  return await db.any(`SELECT * FROM ${tableName} WHERE user_id = $1 ORDER BY id ASC`, [userId]);
}

function insertTask(task, userId) {
  return db.none(`INSERT INTO ${tableName} (todo, user_id) VALUES ($1, $2)`, [task, userId]);
}

async function deleteTask(id) {
  await db.none(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
}

async function taskDone(id) {
  await db.none(`UPDATE ${tableName} t SET is_done=TRUE WHERE t.id = $1`, [id]);
}

async function deleteDone(userId) {
	await db.none(`DELETE FROM ${tableName} WHERE is_done AND user_id = $1`, [userId]);
}

module.exports = {
  getAllTasks,
  insertTask,
  deleteTask,
  taskDone,
	deleteDone
};
