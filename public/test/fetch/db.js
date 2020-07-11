var db;

let dbOpenRequest = window.indexedDB.open('todo_list', 3);
dbOpenRequest.onsuccess = function(event) {
	db = event.target.result;
}

dbOpenRequest.onupgradeneeded = function (event) {
	db = event.target.result;

	if (!db.objectStoreNames.contains('todos')) {
		let todos = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
	} else {
		db.deleteObjectStore('todos');
		let todos = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
	}
}

export function insertTask(task, expiry) {
	return new Promise(function(resolve, reject) {
		let trans = db.transaction([ 'todos' ], 'readwrite').objectStore('todos').add({
			task: task,
			expiry: expiry,
			isDone: false
		});
		trans.onsuccess = function(event) {
			console.log('inserted Record');
			resolve();
		}

		trans.onerror = function(event) {
			reject(event.target.result);
		}
	});
}

export function getAllTasks() {
	return new Promise(function(resolve, reject) {
		let todoList = [];
		const cursoreRequest = db.transaction([ 'todos' ]).objectStore('todos').openCursor()
		cursoreRequest.onsuccess = function (event) {
			let cursor = event.target.result;

			if (cursor) {
				todoList.push(cursor.value);
				cursor.continue();
			}	
			else
				resolve(todoList);
		}

		cursoreRequest.onerror = function(event) {
			reject(event.target.result);
		}
	});
}

export function taskDone(id) {
	return new Promise(function(resolve, reject) {
		let todos = db.transaction([ 'todos' ], 'readwrite').objectStore('todos');
		const getRequest = todos.get(id);

		getRequest.onerror = function(event) {
			reject(event.target.result);
		}

		getRequest.onsuccess = function(event) {
			const data = event.target.result;
			data.isDone = true;

			const putRequest = todos.put(data);
			putRequest.onerror = function(event) {
				reject(event.target.result);
			}
			putRequest.onsuccess = function(event) {
				resolve();
			}
		}
	});
}
