import React, { useState, useEffect } from 'react';
import { getGroupsList } from '../../fetch/groups';

class GroupList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const groups = this.props.groups;
		return (
			<div id = 'groups-container' className = 'd-flex container flex-column'>
				{
					groups.map(e => {
						return (
							<div key = {e.id} className = {`d-flex flex-row justify-content-between align-items-center w-100 ${this.props.active == e.id ? 'active' : ''}`}>
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
