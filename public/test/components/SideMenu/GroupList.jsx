import React, { useState, useEffect } from 'react';
import { getGroupsList } from '../../fetch/groups';

class GroupList extends React.Component {
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
		const groups = this.state.groups;
		return (
			<div id = 'groups-container' className = 'd-flex container flex-column'>
				{
					groups.map(e => {
						return (
							<div key = {e.id} className = {`d-flex flex-row justify-content-between align-items-center w-100 ${this.state.active == e.id ? 'active' : ''}`}>
								<p className = 'mb-0'> {e.group_name} </p>
								<input type = 'button' className = 'btn btn-danger' value = 'X' />
							</div>
						);
					})
				}
			</div>
		);
	}
}

export default GroupList;
