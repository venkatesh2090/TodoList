import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import HelloButton from './components/HelloButton.jsx';

function App(props) {
	let [isOpen, setOpen] = useState(false);
	document.querySelector('#side-menu-button').onclick = function(event) {
		if (isOpen) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	}
	return (<HelloButton open = {isOpen} />);
}

ReactDOM.render(<App />, document.getElementById('render-div'));
