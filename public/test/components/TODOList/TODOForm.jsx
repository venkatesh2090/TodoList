import React from 'react';

class TODOForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<form className = 'd-flex flex-column align-items-start w-75' onSubmit = {this.props.handleSubmit}>
				<label htmlFor = 'todo'> Task </label>
				<div className = 'form-group w-100 d-flex flex-column flex-sm-row mb-2 mb-sm-3'>
					<input id = 'task' type = 'text' className = 'form-control' name = 'todo' onChange = {this.props.onChange} placeholder = 'Do Something' value = {this.props.value} required/>
					<input className = 'btn btn-primary' value = 'Add Task' type = 'submit' />
				</div>
			</form>
		);
	}
}

export default TODOForm;
