import React from 'react';
import ReactDOM from 'react-dom';

class HelloButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { pressed: false }
		this.helloEvent = this.helloEvent.bind(this);
	}

	helloEvent(event) {
		if (this.state.pressed) {
			this.setState({ pressed: false });
		} else {
			this.setState({ pressed: true });
		}
	}

	render() {
		return (
			<div>
				<h1> This page was made with React </h1>
				<button className = 'btn btn-primary' onClick = {this.helloEvent}> { this.state.pressed ? 'Hello' : 'Click' } </button>
			</div>
		);
	}
}

export default HelloButton;
