import React from 'react';
import './LoginMenu.css';

class LoginMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = 'login-container'>
				<form action = '/login' method = 'POST' className = 'needs-validation'>
					<label htmlFor = 'user'>Username</label>
					<div className = 'form-group'>
						<input className = 'form-control' name = 'user' placeholder = 'Username' required/>
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
