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

  document.getElementById('side-menu').addEventListener('focus', event => {
	console.log('Side Menu on focus');
  });
  
  document.getElementById('task').addEventListener('focus', event => {
	console.log('task on focus');
  });

}
