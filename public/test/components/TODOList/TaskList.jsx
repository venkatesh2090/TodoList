import React from 'react';

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
							<div key = {ele.id} className = 'w-100 d-flex flex-row align-items-center justify-content-between ongoing'>
								<h4>{ele.task}</h4>
								<img src = '/static/images/tick.svg' width = '30' height = '30' onClick = {function(event) {
									// TODO: remove task 
									console.log(`impl remove ${ele.id}`);
								}}/>
							</div>
						);
					})
				}
			</div>
		);
	}
}

export default TaskList;
