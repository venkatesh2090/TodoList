import React from 'react';
import './LoginMenu.css';

class LoginMenu extends React.Component {
	constructor(props) {
		super(props);
		this.handleForm = this.handleForm.bind(this);
	}

	handleForm(event) {
		event.preventDefault();
	}

	render() {
		return (
			<div className = 'login-container'>
				<form onSubmit = {this.handleForm} className = 'needs-validation'>
					<label htmlFor = 'username'>Username</label>
					<div className = 'form-group'>
						<input className = 'form-control' name = 'username' placeholder = 'Username' required/>
					</div>

					<label htmlFor = 'password'>Password</label>
					<div className = 'form-group'>
						<input className = 'form-control' type = 'password' name = 'password' placeholder = 'Password' required/>
					</div>

					<div className = 'form-group'>
						<input type = 'submit' value = 'Submit' className = 'w-100 btn btn-primary'/>
					</div>
				</form>
			</div>
		);
	}
}

export default LoginMenu;
