import React from 'react';
import ReactDOM from 'react-dom';
import ListForm from './ListForm.jsx';
import GroupList from './GroupList.jsx';
import { getGroupsList } from '../../fetch/groups.js';

class SideMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: window.sessionStorage.getItem('groupId'),
			groups: []
		}
	}

	async componentDidMount() {
		const groups = await getGroupsList();
		let groupId = window.sessionStorage.getItem('groupId');
		this.setState({ 
			groups: groups != false ? groups : {},
			active: groupId || groups[0].id
		});

		if (groupId == null || groupId == undefined) {
			window.sessionStorage.setItem('groupId', groups[0].id);
		}
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
				<GroupList groups = {this.state.groups} active = {this.state.active}/>
			</div>
		);
	}
}

export default SideMenu;
