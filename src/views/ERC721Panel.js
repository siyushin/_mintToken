import React from 'react';
import Button from 'arwes/lib/Button';
import Words from 'arwes/lib/Words'
import Frame from 'arwes/lib/Frame'
import './ContractPanel.css'

class ERC721Panel extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
			supply: ''
		}

		this.onChangeInput = this.onChangeInput.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	checkInput() {
		return this.state.name !== '' && this.state.supply !== ''
	}

	onChangeInput(event) {
		switch (event.target.id) {
			case 'name':
				this.setState({
					name: event.target.value
				})
				break

			case 'supply':
				this.setState({
					supply: event.target.value
				})
				break

			default:
				break
		}
	}

	onSubmit() {
		this.props.onSubmit(this.state.name, this.state.supply)
	}

	render() {
		return (<div>
			<Words animate className="h2">Welcome to Token Creation Wizard</Words>
			<div className="tableContainer">
				<table className="table">
					<tr>
						<td width="40%" className="tr">
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<input id="name" className="input" type="text" placeholder="Token Name" onChange={this.onChangeInput} />
							</Frame>
						</td>
						<td className="tr">
							<Words animate className="description">The name of the token. 3-25 symbols. Alphanumerical characters, space, and hyphen are accepted.</Words>
						</td>
					</tr>
					<tr>
						<td width="40%" className="tr">
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<input id="supply" className="input" type="number" placeholder="Total Supply" onChange={this.onChangeInput} />
							</Frame>
						</td>
						<td className="tr">
							<Words animate className="description">Total amount of tokens to be generated. Minimum value is 1, and maximum 1000000000000000.</Words>
						</td>
					</tr>
				</table>
			</div>
			<div className="buttonPanel">
				<Button
					onClick={this.props.onCancel}
					animate layer='success'>Cancel</Button>
				<Button
					disabled={!this.checkInput()}
					onClick={this.onSubmit}
					animate layer='success'>Submit</Button>
			</div>
		</div>)
	}
}

export default ERC721Panel