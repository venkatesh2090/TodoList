import React from 'react';

class RemoveButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<input type = 'button' value = 'Remove' className = 'btn btn-danger align-self-end'/>
		);
	}
}

export default RemoveButton;
