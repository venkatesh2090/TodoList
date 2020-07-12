document.querySelector('.navigationBar h3').onclick = function(event) {
	window.location = '/';
}

document.querySelector('#login').onclick = function(event) {
	window.location = '/login';
}

document.querySelector('.toggle-login').onclick = function(event) {
	const loginContainer = document.querySelector('.login-container');
	if (loginContainer.classList.contains('open')) {
		loginContainer.classList.remove('open');
	}
	else {
		loginContainer.classList.add('open');
	}
}
