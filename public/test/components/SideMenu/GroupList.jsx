import React, { useState, useEffect } from 'react';
import { getGroupsList } from '../../fetch/groups';

class GroupList extends React.Component {
	constructor(props) {
		super(props);
		// TODO: implement get default group
		this.state = {
			active: window.sessionStorage.getItem('groupId'),
			groups: []
		}
	}

	async componentDidMount() {
		const groups = await getGroupsList();
		this.setState({ groups: groups != false ? groups : {}});
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
