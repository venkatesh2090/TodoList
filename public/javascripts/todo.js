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
			<input type="button" class="btn btn-danger" value="X"/>
		`;

		document.getElementById('groups-container').appendChild(group);
		group.querySelector('p').onclick = async function(event) {
			await changeList(res.groupId);
		}
		group.querySelector('input[type="button"]').onclick = removeGroupListener(res.groupId);
		
		document.querySelector('#list-form input[type="text"]').value = '';
	}).catch(err => {
		alert(err);
	});
}

function showTaskModal(row) {
	const modal = document.createElement('div');
	modal.className = 'modal fade';
	modal.setAttribute('tab-index', -1);
	modal.setAttribute('id', 'task-modal');

	const date = new Date();
	modal.innerHTML = `
		<style>
			.modal-body {
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
			}
			.modal-body form {
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: flex-start;
			}
			.modal-body form label {
				align-self: center;
				font-size: 1.5em;
			}
		</style>
		<script>
			$('.modal-footer .close-modal').on('click', async function(event) {
				event.preventDefault();
				let formData = new FormData(document.querySelector('.modal-body form'));

				let expiryDate = new Date(formData.get('date'));
				expiryDate.setSeconds(formData.get('seconds'));
				expiryDate.setHours(formData.get('hours'));
				expiryDate.setMinutes(formData.get('minutes'));

				if (expiryDate > new Date("${date}")) {\n
					const body = JSON.stringify({
							id: ${row.id},
							expiry: expiryDate
						});
					const req = new Request('/api/set/timestamp', {
						method: 'POST',
						headers: new Headers({
							'Content-Type': 'application/json'
						}),
						body: body
					});
					const res = await fetch(req);
					if (res.ok) {
						console.log('done');
						$('#task-modal').modal('hide');\n
					} else {
						alert('There was a problem');
					}
				} else {\n
					console.error('not possible');
				}
			});\n
		</script>
		<div class = "modal-dialog">
			<div class = "modal-content">
				<div class = "modal-header">
					<h5 class = "modal-title"> Click ${row.id} </h5>
				</div>
				<div class = "modal-body">
					<form>
						<label for = "time">Expiry</label>
						<div class = "form-group">
							<div class = "form-row">
								<div class = "col">
									<input type = "number" placeholder = "Hours" name = "hours" min = "0" max = "23" class = "form-control" />
								</div>
								<div class = "col">
									<input type = "number" placeholder = "Min" class = "form-control" name = "minutes" min = "0" max = "59" />
								</div>
							</div>
						</div>
						<div class = "form-group justify-content-between w-100">
							<div class = "form-row w-100">
								<div class = "col">
									<input type = "number" placeholder = "Seconds" class = "form-control" name = "seconds" min = "0" max = "59" />
								</div>
								<div class = "col">
									<input type = "date" min = "${date.getFullYear() + '-' + (((date.getUTCMonth() + 1) / 10 < 1 ? '0' : '') + (date.getUTCMonth() + 1).toString()) + '-' + (((date.getUTCDate() + 1) / 10 < 1 ? '0' : '') + (date.getUTCDate() + 1).toString())}" class = "form-control" name = "date"/>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class = "modal-footer">
					<button class = "btn close-modal btn-secondary"> Save </button>
					<button class = "btn btn-secondary" data-dismiss = "modal"> Close </button>
				</div>
			</div>
		</div>
	`;

	$('modals').append(modal);
	$(modal).modal('show');
	$(modal).on('hidden.bs.modal', function(event) {
		event.target.remove();
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
			task.onclick = function(event) {
				showTaskModal(row);
			}

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

window.onload = function(event) {
	if (window.sessionStorage.getItem('groupId') == null) {
		let groupContainer = document.getElementById('groups-container').childNodes[0];
		groupContainer.classList.add("active");
		window.sessionStorage.setItem('groupId', groupContainer.getAttribute('gid'))
		changeList(groupContainer.getAttribute('gid'));
	} else {
		let groupId = window.sessionStorage.getItem('groupId');
		if (document.querySelector(`#groups-container div[gid="${groupId}"]`) != null)
			document.querySelector(`#groups-container div[gid="${groupId}"]`).classList.add('active');
		else {
			window.sessionStorage.setItem('groupId', document.querySelector('#groups-container div').getAttribute('gid'));
			groupId = window.sessionStorage.getItem('groupId');
		}
		changeList(groupId);
	}

	if (document.querySelector('#groups-container .active') == null) {
		document.querySelector('#groups-container div').classList.add('active');
	}

	document.querySelector('#task-form input[type="hidden"]').value = window.sessionStorage.getItem('groupId');
	document.querySelector('#side-menu').style.top = window.getComputedStyle(document.querySelector('.navigationBar')).height;
}

document.getElementById('logout').addEventListener('click', event => {
	window.sessionStorage.removeItem('groupId');
	window.location = '/logout';
});

