import React from 'react';
import Button from 'arwes/lib/Button';
import Words from 'arwes/lib/Words'
import Frame from 'arwes/lib/Frame'
import './ContractPanel.css'

class ContractPanel extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
			symbol: '',
			decimals: '18',
			supply: ''
		}

		this.onChangeInput = this.onChangeInput.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	checkInput() {
		return this.state.name != '' && this.state.symbol != '' && this.state.decimals != '' && this.state.supply != ''
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

			case 'decimals':
				this.setState({
					decimals: event.target.value
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
		this.props.onSubmit(this.state.name, this.state.symbol, this.state.decimals, this.state.supply)
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
								<input id="symbol" className="input" type="text" placeholder="Token Symbol" onChange={this.onChangeInput} />
							</Frame>
						</td>
						<td className="tr">
							<Words animate className="description">This token symbol is already in use. We advise using another symbol.</Words>
						</td>
					</tr>
					<tr>
						<td width="40%" className="tr">
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<input id="decimals" className="input" type="number" placeholder="Decimals" onChange={this.onChangeInput} />
							</Frame>
						</td>
						<td className="tr">
							<Words animate className="description">Defines the number of decimals for the token. 0-18 numerals are accepted. 18 is common practice.</Words>
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
					disabled={!this.checkInput()}
					onClick={this.onSubmit}
					animate layer='success'>Submit</Button>
			</div>
		</div>)
	}
}

export default ContractPanel