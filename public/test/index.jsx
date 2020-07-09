import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import HelloButton from './components/HelloButton.jsx';
import SideMenu from './components/SideMenu.jsx';

function App(props) {
	let [isOpen, setOpen] = useState(false);
	document.querySelector('#side-menu-button').onclick = function(event) {
		if (isOpen) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	}
	return (
		<div className = 'd-flex flex-column justify-content-center align-items-center'>
			<SideMenu open = {isOpen} />
			<HelloButton />
		</div>
	);
}

document.querySelector('#logout').onclick = function(event) {
	window.sessionStorage.removeItem('groupId');
	window.location = '/logout';
}

ReactDOM.render(<App />, document.getElementById('render-div'));
