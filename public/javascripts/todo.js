async function doneElement(element) {
	const id = element.getAttribute('id');
	const url = `/api/done/${id}`;
	const config = {
		method: 'GET'
	};

	const response = await fetch(url, config);
	if (!response.ok) {
		alert(`Could not delete ${id}`);
	}

	element.classList += ' done';
	element.childNodes[1].remove();
}

async function deleteDone() {
	const url = '/api/deleteDone';

	const response = await fetch(url, {
		method: 'GET'
	})

	if (!response.ok)
		alert(`Couldn't delete ${id}`);
	
	const taskList = document.querySelectorAll('#list-container .done');

	taskList.forEach(function (task) {
		task.remove();
	});

}

async function addList() {
	const url = '/api/add/group';

	const req = new Request(url, {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({
			group: document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].value
		})
	});

	const res = await fetch(req).then(res => res.json());

	let group = document.createElement('div');
	group.setAttribute('gid', res.groupId);

	let name = document.createElement('p');
	name.appendChild(document.createTextNode(document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].value));

	group.appendChild(name);

	group.onclick = event => changeList(res.groupId);

	document.getElementById('groups-container').appendChild(group);

	document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].value = '';
}

function renderTodos(data, groupId) {
	const container = document.getElementById('list-container');

	document.querySelector('#list-container .active').className = '';

	const listDiv = document.createElement('div');
	listDiv.classList.add('active');
	listDiv.setAttribute('gid', groupId);

	if (data.length != 0) {
		data.forEach(function(row) {
			console.log(JSON.stringify(row));

			const element = document.createElement('div');
			element.className = 'w-100 d-flex flex-row align-items-center justify-content-between';
			element.setAttribute('id', row.id);

			const task = document.createElement('h4');
			task.className = 'mb-0 my-2';
			task.appendChild(document.createTextNode(row.todo));

			element.appendChild(task);

			if (row.is_done)
				element.classList.add('done');
			else {
				element.classList.add('ongoing');
				let tick = document.createElement('img');
				tick.className = 'mx-1';
				tick.setAttribute('src', '/static/images/tick.svg');
				tick.setAttribute('width', 30);
				tick.setAttribute('height', 30);
				tick.onclick = event => doneElement(element);
				element.appendChild(tick);
			}

			listDiv.appendChild(element);
		});
	}

	container.appendChild(listDiv);
}

async function changeList(groupId) {
	window.sessionStorage.setItem('groupId', groupId);
	document.querySelector('#task-form input[type="hidden"]').value = groupId;
	if (document.querySelector('#groups-container .active') != null)
		document.querySelector('#groups-container .active').className = '';
	
	const activeDiv = document.querySelector(`#groups-container div[gid="${groupId}"]`);
	activeDiv.classList.add('active');

	if (document.querySelector(`#list-container div[gid="${groupId}"]`) == null) {
		const url = `/api/get/tasks/${groupId}`;
		if (activeDiv != null){
			activeDiv.classList.add('active');
		}

		const req = new Request(url, {
			method: 'GET'
		});

		const data = await fetch(req).then(res => res.json());
		renderTodos(data, groupId);
	} else {
		document.querySelector('#list-container .active').className = '';
		document.querySelector(`#list-container div[gid="${groupId}"`).classList.add('active');
	}
};

window.onload = function(event) {
	document.querySelector('#list-container .active').childNodes.forEach(function(e, i, l) {
		if (!e.classList.contains('done')) {
			e.childNodes[1].onclick = async function(event) {
				await doneElement(e);
			};
		}
	});

	document.querySelectorAll('.remove').forEach(element => element.onclick = async function (event) {
		await deleteDone();
	});

	document.getElementById('side-menu-button').onclick = function (event) {
		const sideMenu = document.getElementById('side-menu');
		if (sideMenu.classList.contains('open')){
			sideMenu.classList.remove('open');
		} else {
			sideMenu.classList.add('open');
		}
	}

	document.getElementById('list-btn').onclick = function (event) {
		addList();
	}

	document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].addEventListener('keydown', function(event) {
		if (event.code === 'Enter')
			addList();
	});

	if (window.sessionStorage.getItem('groupId') == null) {
		let groupContainer = document.getElementById('groups-container').childNodes[0];
		groupContainer.classList.add("active");
		window.sessionStorage.setItem('groupId', groupContainer.getAttribute('gid'))
	}

	document.getElementById('groups-container').childNodes.forEach(function (e, i) {
		e.onclick = async function (event) {
			await changeList(e.getAttribute('gid'));
		}

		if (e.getAttribute('gid') == window.sessionStorage.getItem('groupId')) {
			e.classList.add('active');
			changeList(e.getAttribute('gid'));
		}
	});

	if (document.querySelector('#groups-container .active') == null) {
		document.querySelector('#groups-container div').classList.add('active');
	}

	document.querySelector('#task-form input[type="hidden"]').value = window.sessionStorage.getItem('groupId');
}

document.getElementById('logout').addEventListener('click', event => {
	window.sessionStorage.removeItem('groupId');
	window.location = '/logout';
});

