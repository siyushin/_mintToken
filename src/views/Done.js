import React from 'react';
import Words from 'arwes/lib/Words'
import Frame from 'arwes/lib/Frame'
import Loading from 'arwes/lib/Loading'
import Link from 'arwes/lib/Link'
import Line from 'arwes/lib/Line'
import Button from 'arwes/lib/Button'
import Project from 'arwes/lib/Project'
import './Done.css'
import AntennaManager from '../AntennaManager';
import Utilities from '../Utilities';

class Done extends React.Component {
	constructor(props) {
		super(props)

		this.theNumberInput = null
		this.theAddressInput = null

		this.state = {
			balance: 0,
			isChecking: true,
			address: props.deployedAddress,
			toTransfer: 0,
			toAddress: ''
		}

		this.onClickRetry = this.onClickRetry.bind(this)
		this.onChangeInputCount = this.onChangeInputCount.bind(this)
		this.onChangeInputAddress = this.onChangeInputAddress.bind(this)
		this.isDisable = this.isDisable.bind(this)
		this.onTransfer = this.onTransfer.bind(this)
	}

	componentDidMount() {
		if (!this.state.address) {
			this.getReceipt()
		} else {
			this.getBalance(this.state.address)
		}
	}

	getReceipt() {
		AntennaManager.getReceipt(this.props.hxid, res => {
			if (res === 'ERROR') {
				this.setState({
					isChecking: false
				})
			} else {
				this.getBalance(res)

				this.setState({
					address: res
				})

				Utilities.saveAddresses('XRC20', {
					tokenName: this.props.tokenName,
					address: res
				})
			}
		})
	}

	getBalance(address) {
		AntennaManager.getBalanceOf(address, res => {
			this.setState({
				balance: res
			})
		})
		return 0
	}

	onClickRetry() {
		this.getReceipt()
		this.setState({
			isChecking: true
		})
	}

	onChangeInputCount(event) {
		let tempNumber = parseInt(event.target.value)
		if (tempNumber) {
			this.setState({
				toTransfer: tempNumber
			})
		}
	}

	onChangeInputAddress(event) {
		this.setState({
			toAddress: event.target.value
		})
	}

	isDisable() {
		return this.state.toTransfer > 0 && this.state.toAddress != ''
	}

	onTransfer() {
		console.log(this.state.toTransfer, this.state.toAddress)

		if (!AntennaManager.isValidateAddress(this.state.toAddress)) {
			return window.alert('Invalid address.')
		} else if (!this.state.toTransfer > 0) {
			return window.alert('The transfer amount must be mort than 0.')
		} else {
			AntennaManager.transfer(this.state.address, this.state.toAddress, this.state.toTransfer, res => {
				this.theNumberInput.value = 0
				this.theAddressInput.value = ''
				this.setState({
					balance: this.state.balance - this.state.toTransfer,
					toAddress: '',
					toTransfer: 0
				})
			})
		}
	}

	render() {
		return (<div>
			<Line animate layer='success' />

			{!this.state.address && (
				<div className="status">
					<span>Checking: {Utilities.isIoPayMobile() ? this.props.hxid.substr(0, 10) + '...' : this.props.hxid}&nbsp;&nbsp;</span>
					<span>
						{this.state.isChecking ? (
							<Loading animate small />
						) : (
								<Link onClick={this.onClickRetry}>Retry</Link>
							)}
					</span>
				</div>
			)
			}

			{this.state.address && (
				<div className="tableContainer">
					<div style={{ marginBottom: '1rem' }}>
						<Words animate className="description">THE XRC20 CONTRACT</Words>
					</div>
					<div>
						<Frame animate={true} level={3} corners={4} layer='primary'>
							<div className="status">
								<Link href={'https://iotexscan.io/address/' + this.state.address} target="_blank">{this.state.address}</Link>
							</div>
						</Frame>
					</div>

					<div className="xrc21TokenLabel">
						<div className="h3">
							<Words animate className="description">{'The total supply of your ' + this.props.tokenName + ' tokens is'}</Words>
						</div>
						<div>
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<Words animate className="label">{String(this.state.balance)}</Words>
							</Frame>
						</div>
					</div>

					{this.state.balance > 0 && (
						<Frame animate={true} level={3} corners={4} layer='primary'>
							<div className="transferPanel">
								<Words animate className="description">Transfer Token</Words>

								<Frame animate={true} level={3} corners={1} layer='primary' className="inputWithinFrame">
									<input
										ref={node => { this.theNumberInput = node }}
										className="input"
										type="number"
										onChange={this.onChangeInputCount}
										min={0}
										max={this.state.balance}
										step={1}
										placeholder={'0 ' + this.props.tokenName} />
								</Frame>

								<Frame animate={true} level={3} corners={1} layer='primary' className="inputWithinFrame">
									<input
										ref={node => { this.theAddressInput = node }}
										className="input"
										type="text"
										onChange={this.onChangeInputAddress}
										placeholder="IoTeX Address" />
								</Frame>

								<div className="smallButtonPanel">
									<Button
										disabled={!this.isDisable()}
										onClick={this.onTransfer}
										animate layer='success'>Transfer</Button>
								</div>
							</div>
						</Frame>
					)}
				</div>
			)}

			<p>&nbsp;</p>
		</div >)
	}
}

export default Done