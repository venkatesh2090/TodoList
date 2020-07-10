import React from 'react';

class TaskList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = 'd-flex flex-column w-75 align-items-start'>
				<h1> The List </h1>
				<ul>
				{
					this.props.tasks.map(function(ele) {
						return (
							<li key = {ele.id}>
								{ele.task}
							</li>
						);
					})
				}
				</ul>
			</div>
		);
	}
}

export default TaskList;
