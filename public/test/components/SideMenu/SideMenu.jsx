import React from 'react';
import ReactDOM from 'react-dom';
import ListForm from './ListForm.jsx';
import GroupList from './GroupList.jsx';

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
				<ListForm />
				<GroupList />
			</div>
		);
	}
}

export default SideMenu;
