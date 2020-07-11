import React from 'react';
import { taskDone } from '../../fetch/db';

class TaskElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			done: false
		}
		this.doneTask = this.doneTask.bind(this);
	}


	async doneTask(event) {
		// TODO: remove element from objectStore
		await taskDone(this.props.todo.id);
		this.setState({ done: true });
	}

	render() {
		return (
			<div className = 'w-100 d-flex flex-row align-items-center justify-content-between ongoing'>
				<h4 style = {
					this.state.done
					? { textDecoration: 'line-through' }
					: null
				}>{this.props.todo.task}</h4>
				{
					this.state.done
					? null
					: <img src = '/static/images/tick.svg' width = '30' height = '30' onClick = {this.doneTask} />
				}
			</div>
		);
	}
}

export default TaskElement;
