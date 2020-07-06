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
		let data = new FormData(event.target);
		console.log(data.get('groupName'));
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit = {this.handleSubmit} className = 'container d-flex flex-column' method = ''>
				<div className = 'form-group'>
					<input name = 'groupName' className = 'form-control' onChange={this.handleChange} required placeholder = 'Name'/>
				</div>
				<div className = 'form-group'>
					<input className = 'form-control btn btn-primary' value = 'New List' type = 'submit'/>
				</div>
			</form>
		);
	}
}

export default ListForm;
