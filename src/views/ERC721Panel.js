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
			symbol: ''
		}

		this.onChangeInput = this.onChangeInput.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	checkInput() {
		return this.state.name !== '' && this.state.symbol !== ''
	}

	onChangeInput(event) {
		switch (event.target.id) {
			case 'name':
				this.setState({
					name: event.target.value
				})
				break

			case 'symbol':
				this.setState({
					symbol: event.target.value
				})
				break


			default:
				break
		}
	}

	onSubmit() {
		this.props.onSubmit(this.state.name, this.state.symbol)
	}

	render() {
		return (<div>
			<Words animate className="h2">Welcome to Token Creation Wizard</Words>
			<div className="tableContainer">
				<div className="table">
					<tr className="tr">
						<td className="tdLeft">
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<input id="name" className="input" type="text" placeholder="Token Name" onChange={this.onChangeInput} />
							</Frame>
						</td>

						<td className="tdRight">
							<Words animate className="description">The name of the token. 3-25 symbols. Alphanumerical characters, space, and hyphen are accepted.</Words>
						</td>
					</tr>

					<tr className="tr">
						<td className="tdLeft">
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<input id="symbol" className="input" type="text" placeholder="Token Symbol" onChange={this.onChangeInput} />
							</Frame>
						</td>

						<td className="tdRight">
							<Words animate className="description">3-4 characters (example ETH, BTC, BAT, etc.). No spaces. Only alphanumerical characters.</Words>
						</td>
					</tr>
				</div>
			</div>

			<div className="buttonPanel">
				<Button
					onClick={this.props.onCancel}
					className="normalButton"
					animate layer='success'>Cancel</Button>

				<Button
					disabled={!this.checkInput()}
					onClick={this.onSubmit}
					className="normalButton"
					animate layer='success'>Submit</Button>
			</div>

			<p>&nbsp;</p>
		</div>)
	}
}

export default ERC721Panel