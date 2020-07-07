import React, { useState } from 'react';

function GroupList(props) {
	// TODO: get group List
	/**
	 * default from sessionStorage for now
	 */
	let [active, setActive] = useState(window.sessionStorage.getItem('groupId'));
	return (
		<div id = 'groups-container' className = 'd-flex container flex-row'>
			<div className = 'd-flex flex-row justify-content-between align-items-center w-100'>
				<p className = 'mb-0'> default </p>
				<input type = 'button' className = 'btn btn-danger' value = 'X' />
			</div>
		</div>
	);
}

export default GroupList;
