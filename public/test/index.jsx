import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import TODOList from './components/TODOList.jsx';
import SideMenu from './components/SideMenu.jsx';
import LoginMenu from './components/LoginMenu.jsx';
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
		<div className = 'd-flex flex-row justify-content-center align-items-start'>
			<SideMenu open = {isOpen} />
			<TODOList />
			<LoginMenu />
		</div>
	);
}

ReactDOM.render(<App />, document.getElementById('render-div'));
