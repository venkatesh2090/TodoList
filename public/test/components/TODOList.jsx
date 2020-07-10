import React from 'react';
import TODOForm from './TODOList/TODOForm.jsx';
import TaskList from './TODOList/TaskList.jsx';

import { insertTask, getAllTasks } from '../fetch/db';

class TODOList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTodo: '',
			tasks: []
		}
		this.handleForm = this.handleForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		window.addEventListener('load', async function (event) {
			try {
				let tasks = await getAllTasks();
				this.setState({ tasks: tasks });
			} catch (err) {
				console.log(err);
				console.log(err.code);
			}
		}.bind(this), true);
	}

	async handleForm(event) {
		event.preventDefault();
		const formData = new FormData(event.target)
		const task = formData.get('todo');
		await insertTask(task, new Date());
		const taskList = await getAllTasks();
		this.setState({ 
			currentTodo: '',
			tasks: taskList
		});
	}

	handleChange(event) {
		this.setState({ currentTodo: event.target.value });
	}

	render() {
		return (
			<div className = 'container d-flex flex-column align-items-center'>
				<hr />
				<TODOForm onChange = {this.handleChange} value = {this.state.currentTodo} handleSubmit = {this.handleForm}/>
				<TaskList tasks = {this.state.tasks} />
			</div>
		);
	}
}

export default TODOList;
