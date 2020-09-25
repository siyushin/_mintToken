import React from 'react';
import Button from 'arwes/lib/Button';
import './HomePage.css'

class HomePage extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (<div className="block">
			<Button animate className="button" onClick={this.props.onClickERC20}>ERC 20</Button>
			<Button animate className="button" onClick={this.props.onClickERC721}>ERC 721</Button>
		</div>)
	}
}

export default HomePage