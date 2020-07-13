document.querySelector('.navigationBar h3').onclick = function(event) {
	window.location = '/';
}

if (window.innerWidth <= 420) {
	document.querySelector('#login').onclick = function(event) {
		window.location = '/login';
	}
} else {
	if ($('#logout').length == 0) {
		$('.toggle-login').click(function(event) {
			if ($('.login-container').hasClass('open')) {
				$('.login-container').removeClass('open');
			}
			else {
				$('.login-container').addClass('open');
			}
		});
	}
}
