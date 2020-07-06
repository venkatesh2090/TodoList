function isRemove(event) {
	$('#confirmation').modal('show');
	return new Promise((resolve, reject) => {
		const thisModalFooter = document.querySelector('#confirmation .modal-dialog .modal-content .modal-footer'); 
		try {
			thisModalFooter.querySelector('button.btn-danger').onclick = function(event) {
				resolve(true);
			}

			thisModalFooter.querySelector('button.btn-secondary').onclick = function(event) {
				resolve(false);
			}

		} catch (err) {
			reject(err);
		}
	});
}

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

function addList(groupName) {
	const url = '/api/add/group';

	const req = new Request(url, {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({
			group: groupName
		})
	});

	fetch(req).then(res => {
		if (res.ok)
			return res.json();
		else
			throw "Couldn't insert group";
	}).then(res => {
		let group = document.createElement('div');
		group.setAttribute('gid', res.groupId);
		group.className = 'd-flex flex-row justify-content-between align-items-center w-100';

		group.innerHTML = `
			<p class="mb-0">${groupName}</p>
			<input type="button" class="btn btn-danger" value="R"/>
		`;

		document.getElementById('groups-container').appendChild(group);


		removeModal = document.querySelector('#remove-target .modal-dialog .modal-content .modal-body');
		
		let container = document.createElement('div');
		container.className = "d-flex flex-row algin-items-center w-100 justify-content-between my-1";
		container.setAttribute('gid', res.groupId);

		container.innerHTML = `
			<p class="my-0"> 
				${groupName} 
			</p>

			<input type="button" class="btn btn-warning" value="Remove" />
		`;
		removeModal.appendChild(container);

		removeModal.querySelector(`div[gid="${res.groupId}"] input[type="button"]`).onclick =  async e => await removeGroup(res.groupId);

		document.querySelector('#list-form input[type="text"]').value = '';
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
		document.querySelector('#groups-container .active').classList.remove('active');
	
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
}

function removeGroupListener(groupId) {
	return async function (event) {
		if (groupId == window.sessionStorage.getItem('groupId')) {
			$('#warning').modal('show');
		}
		else {
			const remove = await isRemove(event).catch(er => console.error(er));
			if (remove) {
				removeGroup(groupId);
			} else {
				console.log(`Didn't remove group`);
			}
		}
	}
}

async function removeGroup(groupId) {
	const url = `/api/delete/group/${groupId}`;

	const req = new Request(url, {
		method: 'GET'
	});

	const res = await fetch(req).then(res => res.ok);

	if (!res)
		alert("Couldn't delete group");
	else {
		document.querySelector(`#remove-target .modal-dialog .modal-content .modal-body div[gid="${groupId}`).remove();
		document.querySelector(`#groups-container div[gid="${groupId}"]`).remove();
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

document.getElementById('list-form').addEventListener('submit', function(event) {
	const formData = new FormData(event.target);
	addList(formData.get('group'));
	event.preventDefault();
});

document.getElementById('groups-container').childNodes.forEach(function (e, i) {
	e.childNodes[0].onclick = async function (event) {
		await changeList(e.getAttribute('gid'));
	}
	e.childNodes[1].onclick = removeGroupListener(e.getAttribute('gid'));
});

document.querySelector('#remove-target .modal-dialog .modal-content .modal-body').childNodes.forEach(e => {
	e.childNodes[1].onclick = async function() {
		await removeGroup(e.getAttribute('gid'));
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

