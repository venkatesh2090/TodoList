import React from 'react';

class RemoveButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className = 'w-100 d-flex flex-column'>
				<input type = 'button' value = 'Remove' className = 'remove btn btn-danger d-block d-sm-none' onClick = {this.props.removeDone}/>
				<div onClick = {this.props.removeDone} className = 'remove align-self-end d-sm-flex d-none flex-row align-items-center'><div /></div>
			</div>
		);
	}
}

export default RemoveButton;
