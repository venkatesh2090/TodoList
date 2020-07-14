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
			#modal-form {
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center
				width: 100%;
				padding-left: 10%;
				padding-right: 10%;
			}
			.notification-container {
				display: flex;
				flex-flow: row;
				flex-grow: 1;
			}
			.notification-container small {
				display:none;
				align-self: flex-start;
			}
			#modal-form .row {
				padding-bottom: 1em;
				flex-wrap: nowrap;
			}
			#modal-form .row label {
				margin-bottom: 0;
				align-self: center;
				padding-right: 1em;
			}
		</style>
		<script>
			var expiryDate;

			function validateExpiry() {
				return expiryDate > new Date("${date}");
			}

			function hideNotifs() {
				$('.notification-container small').css('display', 'none');
			}

			function validNotif() {
				hideNotifs();
				$('.notification-container .valid').css('display', 'block');
			}

			function invalidNotif() {
				hideNotifs();
				$('.notification-container .invalid').css('display', 'block');
			}
			
			function oldExpiryNotif() {
				hideNotifs();
				$('.notification-container .invalid-old').css('display', 'block');
			}

			function missingNotif() {
				hideNotifs();
				$('.notification-container .invalid-missing').css('display', 'block');
			}
			
			$('#modal-form').on('submit', async function(event) {
				event.preventDefault();
				let formData = new FormData(document.querySelector('.modal-body form'));

				let dateInput = document.querySelector('#modal-form input[type=date]');
				let timeInput = document.querySelector('#modal-form input[type=time]');
				if (dateInput.validity.valid && timeInput.validity.valid) {
					expiryDate = new Date(formData.get('date'));

					const time = formData.get('time');
					const [hours, minutes] = time.split(':').map(e => new Number(e));

					expiryDate.setHours(hours);
					expiryDate.setMinutes(minutes);

					if (validateExpiry()) {
						validNotif();
					} else {
						oldExpiryNotif();
						expiryDate = null;
					}
				}
				else {
					missingNotif();
					expiryDate = null;
				}
			});\n
			
			async function sendExpiry() {
				if (validateExpiry()) {
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
					if (!res.ok) {
						console.error("There was a server error. Couldn't update timestamp");
					}
				} else {
					console.error('timestamp not sent');
				}
			};

			$('#task-modal').on('hide.bs.modal', function(event) {
				if (expiryDate)
					sendExpiry();
			});
		</script>
		<div class = "modal-dialog">
			<div class = "modal-content">
				<div class = "modal-header">
					<h5 class = "modal-title"> Click ${row.id} </h5>
				</div>
				<div class = "modal-body">
					<form id = "modal-form">
						<div class = "row">
							<label for = "time"> Time </label>
							<input name = "time" type = "time" class = "form-control" required/>
						</div>
						<div class = "row">
							<label for = "date"> Date </label>
							<input type = "date" class = "form-control" min = "${date.getFullYear() + '-' + (((date.getUTCMonth() + 1) / 10 < 1 ? '0' : '') + (date.getUTCMonth() + 1).toString()) + '-' + ((date.getUTCDate() / 10 < 1 ? '0' : '') + date.getUTCDate().toString())}" name = "date" required/>
						</div>
					</form>
				</div>
				<div class = "modal-footer">
					<div class = "notification-container">
						<small class = "text-danger invalid">Couldn't add expiry</small>
						<small class = "text-danger invalid-missing">Please fill everything</small>
						<small class = "text-danger invalid-old">Choose a time in the future</small>
						<small class = "text-primary valid">Saved expiry</small>
					</div>
					<button class = "btn close-modal btn-primary" type = "submit" form = "modal-form"> Save </button>
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

