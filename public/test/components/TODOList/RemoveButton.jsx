import React from 'react';

class RemoveButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = 'align-self-end'>
				<div onClick = {this.props.removeDone} className = 'remove'><div /></div>
			</div>
		);
	}
}

export default RemoveButton;
