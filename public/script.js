import template from './test.pug';

const locals  = {
	users: [ 'venkatesh',	'harish' ]
};

document.querySelector('body').innerHTML = template(locals);

window.onload = event => {
	console.log(template(locals));
};
