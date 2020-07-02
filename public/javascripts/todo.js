async function doneElement(element) {
	const id = element.getAttribute('id');
	const url = `/api/done/${id}`;
	const config = {
		method: 'GET'
	};

	const response = await fetch(url, config);
	if (!response.ok) {
		alert(`Could not delete ${id}`);
	} else {
		element.classList += ' done';
		element.childNodes[1].remove();
	}
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

	fetch(req).then(res => {
		if (res.ok)
			return res.json();
		else
			throw "Couldn't insert group";
	}).then(res => {
		let group = document.createElement('div');
		console.log(JSON.stringify(res.groupId));
		group.setAttribute('gid', res.groupId);

		let name = document.createElement('p');
		name.appendChild(document.createTextNode(document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].value));

		group.appendChild(name);

		group.onclick = event => changeList(res.groupId);

		document.getElementById('groups-container').appendChild(group);

		document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].value = '';
	}).catch(err => {
		alert(err);
	});
}

function renderTodos(data, groupId) {
	const container = document.getElementById('list-container');

	try {
		document.querySelector('#list-container .active').className = '';
	}
	catch (err) {}
	

	const listDiv = document.createElement('div');
	listDiv.classList.add('active');
	listDiv.setAttribute('gid', groupId);

	if (data.length != 0) {
		data.forEach(function(row) {
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
		try {
			document.querySelector('#list-container .active').className = '';
		} catch(err) {}
		document.querySelector(`#list-container div[gid="${groupId}"`).classList.add('active');
	}
};

async function removeGroup(container) {
	const groupId = container.getAttribute('gid');
	if (groupId == window.sessionStorage.getItem('groupId')) {
		document.querySelector('#remove-target .modal-dialog .modal-content .modal-footer small').classList.remove('d-none');
	}
	else {
		const url = `/api/delete/group/${groupId}`;

		const req = new Request(url, {
			method: 'GET'
		});

		const res = await fetch(req).then(res => res.ok);

		console.log(res);
		if (!res)
			alert("Couldn't delete group");
		else {
			container.remove();
			document.querySelector(`#groups-container div[gid="${groupId}"]`).remove();
		}
	}
}

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


document.getElementById('groups-container').childNodes.forEach(function (e, i) {
	e.childNodes[0].onclick = async function (event) {
		await changeList(e.getAttribute('gid'));
	}
});

document.querySelector('#remove-target .modal-dialog .modal-content .modal-body').childNodes.forEach(e => {
	const groupId = e.getAttribute('gid');
	e.childNodes[1].onclick = async function() {
		await removeGroup(e);
	}
});

$('#remove-target').on('hide.bs.modal', () => {
	document.querySelector('#remove-target .modal-dialog .modal-content .modal-footer small').classList.add('d-none');
});

window.onload = function(event) {
	if (window.sessionStorage.getItem('groupId') == null) {
		let groupContainer = document.getElementById('groups-container').childNodes[0];
		groupContainer.classList.add("active");
		window.sessionStorage.setItem('groupId', groupContainer.getAttribute('gid'))
		changeList(groupContainer.getAttribute('gid'));
	} else {
		const groupId = window.sessionStorage.getItem('groupId');
		document.querySelector(`#groups-container div[gid="${groupId}"]`).classList.add('active');
		changeList(groupId);
	}

	if (document.querySelector('#groups-container .active') == null) {
		document.querySelector('#groups-container div').classList.add('active');
	}

	document.querySelector('#task-form input[type="hidden"]').value = window.sessionStorage.getItem('groupId');
}

document.getElementById('logout').addEventListener('click', event => {
	window.sessionStorage.removeItem('groupId');
	window.location = '/logout';
});

