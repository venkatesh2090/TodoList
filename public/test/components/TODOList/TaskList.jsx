import React from 'react';
import TaskElement from './TaskElement.jsx';

class TaskList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = 'd-flex flex-column w-75 align-items-start'>
				<h1 className = 'align-self-end'> Remove impl </h1>
				{
					this.props.tasks.map(function(ele) {
						return (
							<TaskElement key = {ele.id} task = {ele.task}/>
						);
					}.bind(this))
				}
			</div>
		);
	}
}

export default TaskList;
