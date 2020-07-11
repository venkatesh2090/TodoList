import React from 'react';
import ReactDOM from 'react-dom';

class ListForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groupName: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({groupName: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<form onSubmit = {this.handleSubmit} className = 'container d-flex flex-column' method = ''>
					<div className = 'form-group'>
						<input name = 'groupName' className = 'form-control' onChange={this.handleChange} required placeholder = 'Login to access Groups' disabled/>
					</div>
					<div className = 'form-group'>
						<input className = 'form-control btn btn-primary' value = 'New List' type = 'submit'/>
					</div>
				</form>
			</div>
		);
	}
}

export default ListForm;
