import React from 'react';
import ReactDOM from 'react-dom';

class SideMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let _class = 'h-100';
		if (this.props.open)
			_class += ' open';
		return (
			<div id = 'side-menu' style = {{
				top: window.getComputedStyle(document.querySelector('.navigationBar')).height,
				paddingTop: '.5rem'
			}} className = {_class}>
				<h1> Here </h1>
			</div>
		);
	}
}

export default SideMenu;
