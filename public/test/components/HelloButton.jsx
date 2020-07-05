import React from 'react';
import ReactDOM from 'react-dom';

class HelloButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { pressed: false }
		this.helloEvent = this.helloEvent.bind(this);
	}

	helloEvent(event) {
		this.setState({ pressed: true });
	}

	render() {
		if (this.state.pressed) {
			return (
				<h1>
					Hello
				</h1>
			);
		}
		return (
			<button className = 'btn btn-primary' onClick = {this.helloEvent}>
				Click
			</button>
		);
	}
}

export default HelloButton;
