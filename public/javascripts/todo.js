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
	document.getElementById('groups-container').appendChild(group);

	document.getElementById('side-menu').childNodes[0].childNodes[0].childNodes[0].value = '';
}

async function changeList(groupId) {
	window.sessionStorage.setItem('groupId', groupId);
	document.querySelector('#groups-container .active').className = '';
	const url = `/api/get/tasks/${groupId}`;

	const activeDiv = document.querySelector(`#groups-container div[gid="${groupId}"]`);
	if (activeDiv != null){
		activeDiv.classList.add('active');
	}

	const req = new Request(url, {
		method: 'GET'
	});

	fetch(req).then(res => res.json())
		.then(res => console.log(res));
};

window.onload = function(event) {
	document.getElementById('list-container').childNodes.forEach(function(e, i, l) {
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
			console.log(e.getAttribute('gid'));
			await changeList(e.getAttribute('gid'));
		}

		if (e.getAttribute('gid') == window.sessionStorage.getItem('groupId')) {
			e.classList.add('active');
		}
	});
}

document.getElementById('logout').addEventListener('click', event => {
	window.location = '/logout';
});

